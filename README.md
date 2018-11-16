# IOTA Research Project


## DHT122 sensor on Raspberry Pi
Use [this guide](https://tutorials-raspberrypi.com/raspberry-pi-measure-humidity-temperature-dht11-dht22/) to set up the Raspberry Pi with the DHT22 temperature and humidity sensor and install the Adafruit python library for reading sensor data.

## MQTT With Authentication

To produce a data stream and control its subscriptions we use the MQTT messaging protocol. The implementation is [Eclipse Mosquitto](https://projects.eclipse.org/projects/technology.mosquitto) together with [Mosquitto-auth-plug](https://github.com/jpmens/mosquitto-auth-plug) and PostgreSQL database to manage users. Follow the guide in Mosquitto-auth-plugs readme to set up.

## Mosquitto for linux based systems

Follow this guide when setting up the mosquitto auth plugin: [Link to a setup guide](http://www.yasith.me/2016/04/securing-mqtt-connection-using.html)

## Run `check_payment`

```
cd server
npm run check_payment
```

## Lint server code

Install `tsfmt` in VS-Code and enable auto formatting for typescript files in the settings. Or run from terminal using `tsfmt -r path/to/file.ts`.
