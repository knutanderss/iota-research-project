# IOTA Research Project


## DHT122 sensor on Raspberry Pi
Use [this guide](https://tutorials-raspberrypi.com/raspberry-pi-measure-humidity-temperature-dht11-dht22/) to set up the Raspberry Pi with the DHT22 temperature and humidity sensor and install the Adafruit python library for reading sensor data.

## MQTT With Authentication

### As Mosquitto Auths readme is pretty flaued we include the setup here

First of all you need a running database. We choose PostgreSQL because it was one of the most supported ones.

To set up this datebase follow these steps:

1. Install database with `sudo apt-get install postgresql postgresql-contrib`
2. Change user to be this database `sudo su - postgres`
3. Create a user with `createuser postgres` You will be propted to enter password and here we assume that the password is password. 
4. Create database with `createdb -O postgres mosquitto` and this also sets postgres as owner of this database.
5. Log into this database with `psql mosquitto`
6. In this shell one can use normal postsql to communicate with the database.
7. exit shell with ctrl+d 
8. Logout from user either with `ctrl+d` or with the command `logout`
9. Go to the the folder postgres and run teh setup.sh as sudo and enter password when pormpted
10. Now the database is ready to go! 

For now the setup script creates two tables in the database for authetication. It also creates a superuser for our raspberrie py. This user is called user1 and has password 'password'

## Mosquitto for linux based systems

To set up the Mosquitto server with authentication follow these steps:

1. Download both the Mosquitto server and Mosquitto auth plug from git by running the comand.
`git clone https://github.com/eclipse/mosquitto.git
git clone https://github.com/jpmens/mosquitto-auth-plug.git`
2. Then we need to build the mosquitto broker from the source files with some dependencis installed. 
`cd mosquitto
sudo apt install build-essential
sudo apt install libc-ares-dev
sudo apt install uuid-dev 
sudo apt install libssl-dev
make binary
make install`
3. Now copy the comfig.mk to mosquitto auth plug sources.
`cp ../config.mk ../mosquitto-auth-plug/config.mk`
4. Now install dependencis:
`sudo apt install openssl
sudo apt install libssl-dev
sudo apt install libcurl4-openssl-dev5.` 
5. As the config file takes absolute paths you need to make sure that these paths are correct:

MOSQUITTO_SRC =/home/steffen/dev/iota-research-project/mosquitto

OPENSSLDIR = /usr/bin

6. Now go back one folder with `cd ..` and edit mosquitto conf so that it points to the correct path for the file auth-plug.so.
It's in this line, replace USER
home/USER/dev/iota-research-project/mosquitto-auth-plug/auth-plug.so
7. Run mosquitto server with:
`mosquitto -c /path/to/mosquitto.conf`

## To test it
Make one terminal run the command: 
`mosquitto_sub -u user1 -P password -t test/topic`
And another one run the command:
`mosquitto_pub -u user1 -P password -t test/topic -m "Hello world"`

## Run `check_payment`

```
cd server
npm run check_payment
```

## Lint server code

Install `tsfmt` in VS-Code and enable auto formatting for typescript files in the settings. Or run from terminal using `tsfmt -r path/to/file.ts`.
