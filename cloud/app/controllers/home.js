var express = require('express'),
  router = express.Router(),
  Article = require('../models/article'),
  EventHubClient = require('azure-event-hubs').Client;

var raw_data = [];
var connectionString = '<PRIMARY CONNECTION STRING FOR IOTHUB>';

var printError = function (err) {
  console.log(err.message);
};

var proper_format = function(arr) {
	var string = "[['Timestamp', 'Temperature (in Celsius)'],";
	for(var i=0;i<arr.length;i++){
		string = string + "['" + arr[i][0] + "'," + arr[i][1] + "],";
	}	
	string = string + "]";
	return string;
}

var printMessage = function (message) {
  // Keep 60 most recent readings to show in graph
  if(raw_data.length == 60){
  	raw_data = raw_data.slice(-59);
  }
  raw_data.push([message.body['timestamp'], parseFloat(message.body['temp_celsius'])]);
  console.log('Received reading!');
};

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Azure-MQTT-Demo',
      data_array: proper_format(raw_data)
    });
});

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    }).catch(printError);
