#!/usr/bin/python
import sys
import Adafruit_DHT
import subprocess
import datetime

'''
Script to publish data from sensor dh22 for temperature and humidity using MQTT with authentication
'''


while True:

    humidity, temperature = Adafruit_DHT.read_retry(11, 4,delay_seconds=0.01)
    # print (temperature)
    print "Temp: {0:0.1f} C  Humidity: {1:0.1f} %".format(temperature, humidity)
    # Publish data to the 3 different channels from the sensors on the raspberry pie
    
    sub_hum_com = subprocess.Popen(["mosquitto_pub", "-t","hum","-u", "user1", "-P", "password", "-m", str(humidity), "-d"], stdout=subprocess.PIPE).communicate()
    # debug print(sub_hum_com[0])
    
    subprocess.Popen(["mosquitto_pub", "-t","temp","-u", "user1", "-P", "password", "-m", str(temperature)], stdout=subprocess.PIPE).communicate()
    subprocess.Popen(["mosquitto_pub", "-t","date-time","-u", "user1", "-P", "password", "-m", str(datetime.datetime.now())], stdout=subprocess.PIPE).communicate()
    
    
#def read_retry(sensor, pin, retries=15, delay_seconds=2, platform=None):
    """Read DHT sensor of specified sensor type (DHT11, DHT22, or AM2302) on
    specified pin and return a tuple of humidity (as a floating point value
    in percent) and temperature (as a floating point value in Celsius).
    Unlike the read function, this read_retry function will attempt to read
    multiple times (up to the specified max retries) until a good reading can be
    found. If a good reading cannot be found after the amount of retries, a tuple
    of (None, None) is returned. The delay between retries is by default 2
    seconds, but can be overridden.
    """
