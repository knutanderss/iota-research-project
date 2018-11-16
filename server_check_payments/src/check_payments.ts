import IOTA = require("iota.lib.js");
import "moment";
import moment = require("moment");
import { Client } from "pg";

const iota = new IOTA({
    provider: "https://nodes.devnet.iota.org/",
});
iota.api.getNodeInfo((info) =>
    console.log("Connected successfully to IOTA node"),
);

const client = new Client({
    database: "mosquitto",
    host: "127.0.0.1",
    password: "password",
    port: 5432,
    user: "postgres",
});

interface ITransactionObject {
    hash: string;
    signatureMessageFragment: string;
    address: string;
    value: number;
    tag: string;
    timestamp: number;
    currentIndex: number;
    lastIndex: number;
    bundle: number;
    trunkTransaction: string;
    branchTransaction: string;
    attachmentTimestamp: number;
    attachmentTimestampLowerBound: number;
    attachmentTimestampUpperBound: number;
    nonce: string;
    state?: boolean;
}

const ACCESS_PRICE = 2;
const HOURS = 6;

// The IOTA address where funds will be deposited
const DEPOSIT_ADDRESS = "NRHIUJL9NGMCRYT9BYRLAHAPBVIVIUIPIGWRQKTIBPNRPOOTMEGJHXBASFILYGNQIJOLGGPJMSJMNFWAXSCZVOCCSD";

function promisify<Arg1, Result>(
    fn: (arg1: Arg1, cb: (err: Error, result: Result) => void) => void): (arg1: Arg1) => Promise<Result> {
    return (arg1) => new Promise<Result>(
        (resolve, reject) => fn(arg1, (err, result) => err ? reject(err) : resolve(result)),
    );
}

const getDeposits = (depositAddress: string) =>
    new Promise<ITransactionObject[]>((resolve, reject) =>
        iota.api.findTransactionObjects(
            { addresses: [depositAddress] },
            (err, result) => err ? reject(err) : resolve(result),
        ));

const getLatestInclusion = (hashes: string[]) =>
    new Promise<boolean[]>((resolve, reject) =>
        iota.api.getLatestInclusion(hashes, (err, result) => err ? reject(err) : resolve(result)));

const isValidTransaction = (t: ITransactionObject): boolean =>
    t.value >= ACCESS_PRICE
    && moment(t.timestamp * 1000).isAfter(moment().subtract(HOURS, "hour"));

const extractAndValidateMessage = async (transaction: ITransactionObject) => {
    // message should be in the form of: '{"username": "{username}"}'
    try {
        const message = JSON.parse(iota.utils.extractJson([transaction]));
        if (!(message && message.hasOwnProperty("username"))) {
            const errorMsg = ` --> Transaction (${transaction.hash.substr(0, 8)}…)
             is valid but did not contain a username.`;
            return Promise.reject(errorMsg);
        }
        return Promise.resolve(message);
    } catch (e) {
        const errorMsg = `Error when processing transaction (${transaction.hash.substr(0, 8)}…)`;
        return Promise.reject(errorMsg);
    }
};

function log_transaction_info(transaction: ITransactionObject) {
    const status = transaction.state ? "confirmed" : "pending";
    const startOfHash = transaction.hash.substr(0, 8);
    const value = transaction.value;
    const issued = moment(transaction.timestamp * 1000).fromNow();
    const issuedLocale = moment(transaction.timestamp * 1000).toLocaleString();
    const transactionInfo = ` --> Found a ${status} transaction (${startOfHash}…) for ${value} iotas` +
        `issued ${issued} [${issuedLocale}]`;
    console.log(transactionInfo);
}

const checkTransaction = (transactions: ITransactionObject[]) => (state: boolean, index: number): void => {
    transactions[index].state = state;
    transactions.filter(isValidTransaction).forEach(async (transaction) => {
        try {
            const message = await extractAndValidateMessage(transaction);
            const result = await client.query(
                "UPDATE acls SET rw = 1 where username = $1::text RETURNING *",
                [message.username],
            );
            console.log(" --> User %s successfully granted access", result.rows[0].username);
        } catch (e) {
            console.log("Something went wrong when checking transaction");
            console.log(e);
        }
    });
};

const checkForPayment = async () => {
    console.log("\nChecking deposits on IOTA address %s", DEPOSIT_ADDRESS);
    try {
        const transactions = await getDeposits(DEPOSIT_ADDRESS);
        console.log(" --> %d transactions found for address ", transactions.length, DEPOSIT_ADDRESS);
        const states = await getLatestInclusion(transactions.map((t: any) => t.hash));
        states.forEach(checkTransaction(transactions));
    } catch (e) {
        console.log("Something went wrong when checking for payment");
        console.log(e);
    }
};

async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.log("Could not connect to DB");
    }
    console.log("Connected successfully to PostgreSQL database");
    setInterval(checkForPayment, 5 * 1000);
}

main();
