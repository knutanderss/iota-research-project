# IOTA Research Project

## MQTT With Authentication
To produce a data stream and control its subscriptions we use the MQTT messaging protocol. The implementation is [Eclipse Mosquitto](https://projects.eclipse.org/projects/technology.mosquitto) together with [Mosquitto-auth-plug](https://github.com/jpmens/mosquitto-auth-plug) and PostgreSQL database to manage users. Follow the guide in Mosquitto-auth-plugs readme to set up. 