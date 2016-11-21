# Azure MQTT


### About
Server and RPi code to send temperature readings to IoT hub from a Raspberry Pi (every minute), and use that data to plot a timeseries graph of temperature readings of the last one hour using Google Charts API. Server code ready to be pushed to Azure.


### Running it
* Run `npm install` from rpi/ folder on the raspberry pi device. Then, run `npm start` to start sending readings to Azure central hub via MQTT protocol.
* Run `npm install` from azure/ folder on any machine. Then, run `npm start` and navigate to localhost:3000 to view a graph of temperature readings of the last one hour (collected at a frequency of one reading/10 seconds from the mqtt node, ie, Raspberry Pi).


### Setting up Azure
Read (this)[nothing] tutorial to set up your Azure account for this set-up to work.


