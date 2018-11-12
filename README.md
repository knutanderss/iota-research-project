# IOTA Research Project

## MQTT With Authentication
To produce a data stream and control its subscriptions we use the MQTT messaging protocol. The implementation is [Eclipse Mosquitto](https://projects.eclipse.org/projects/technology.mosquitto) together with [Mosquitto-auth-plug](https://github.com/jpmens/mosquitto-auth-plug) and PostgreSQL database to manage users. Follow the guide in Mosquitto-auth-plugs readme to set up. 


## Mosquitto for linux based systems
Follow this guide when setting up the mosquitto auth plugin: [Link to a setup guide](http://www.yasith.me/2016/04/securing-mqtt-connection-using.html)
