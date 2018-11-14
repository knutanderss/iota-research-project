import "moment";
import { Client } from "pg";
import IOTA = require("iota.lib.js");
import moment = require("moment");

const iota = new IOTA({
  provider: "https://nodes.devnet.iota.org/"
});
iota.api.getNodeInfo(info =>
  console.log("Connected successfully to IOTA node")
);

const client = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "mosquitto",
  password: "password",
  port: 5432
});

interface TransactionObject {
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
}

const ACCESS_PRICE = 500;
const HOURS = 6; 

// The IOTA address where funds will be deposited
const DEPOSIT_ADDRESS = "XBXMCRYITBINKG9OSEUCFSEIGXUGBUE9KWGWTUCLOADTHQTH9LYSQLTGZ9ESJWDONDBVGBAYMLCYVB9ODFLAGMHVLD";

function promisify<Arg1, Result>(fn:(arg1:Arg1, cb:(err:Error, result:Result) => void) => void) : (arg1:Arg1) => Promise<Result> {
    return (arg1) => new Promise<Result>((resolve, reject) => fn(arg1, (err, result) => err ? reject(err) : resolve(result)))
}

const getDeposits = (deposit_address:string) =>
    new Promise<TransactionObject[]>((resolve, reject) => 
        iota.api.findTransactionObjects({ addresses: [deposit_address] }, (err, result) => err ? reject(err) : resolve(result)));

const getLatestInclusion = (hashes:string[]) =>
    new Promise<boolean[]>((resolve, reject) => 
        iota.api.getLatestInclusion(hashes, (err, result) => err ? reject(err) : resolve(result)));

const isValidTransaction = (t:TransactionObject):boolean => 
    t.value >= ACCESS_PRICE
    && moment(t.timestamp * 1000).isAfter(moment().subtract(HOURS, 'hour'));
    
const extractAndValidateMessage = async (transaction:any) => {
    // message should be in the form of: '{"username": "{username}"}'
    try {
        const message = JSON.parse(iota.utils.extractJson([transaction]));
        if (!(message && message.hasOwnProperty("username"))) {
            const error_msg = ` --> Transaction (${transaction.hash.substr(0, 8)}…) is valid but did not contain a username.`;
            return Promise.reject(error_msg);
        }
        return Promise.resolve(message);
    } catch (e) {
        const error_msg = `Error when processing transaction (${transaction.hash.substr(0, 8)}…)`;
        return Promise.reject(error_msg);
    }
}

const checkTransaction = (transactions:any[]) => (state:boolean, index:number) : void => {
    transactions[index].state = state;
    transactions.filter(isValidTransaction).forEach(async (transaction:any) => {
        const transaction_info = ` --> Found a 
            ${transaction.state ? 'confirmed' : 'pending'} 
            transaction (${transaction.hash.substr(0, 8)}…) 
            for ${transaction.value} iotas 
            issued ${moment(transaction.timestamp * 1000).fromNow()} 
            [${moment(transaction.timestamp * 1000).toLocaleString()}]`;
        console.log(transaction_info);
        try {
            const message:any = await extractAndValidateMessage(transaction);
            const result:any = await client.query('UPDATE acls SET rw = 1 where username = $1::text', [message.username]);
            console.log(' --> User %s successfully granted access', result.value.username);
        } catch(e) {
            console.log("Something went wrong when checking transaction");
            console.log(e);
        }
    });
}

const checkForPayment = async () => {
  console.log("\nChecking deposits on IOTA address %s", DEPOSIT_ADDRESS);
  try {
        const transactions = await getDeposits(DEPOSIT_ADDRESS);
        console.log( " --> %d transactions found for address ", transactions.length, DEPOSIT_ADDRESS);
        const states = await getLatestInclusion(transactions.map((t:any) => t.hash));
        states.forEach(checkTransaction(transactions));
  } catch(e) {
      console.log("Something went wrong when checking for payment");
      console.log(e);
  }
}

async function main(){
    try {
        await client.connect();
    } catch(e){
        console.log("Could not connect to DB");
    }
    console.log("Connected successfully to PostgreSQL database");
    setInterval(checkForPayment, 5 * 1000);
}

main();