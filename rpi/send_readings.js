'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var child_process = require('child_process');
 
var connectionString = '<CONNECTION STRING FOR DEVICE>';
 
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

// Send temperature readings every 10 seconds 
var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
    });
    setInterval(function(){
      child_process.exec('vcgencmd measure_temp', function(error, stdout, stderr){
        var temp = parseFloat(stdout.split('=')[1].split("'")[0]);
        var return_json = {};
        return_json['temp_celsius'] = temp;
        var d = new Date();
        return_json['timestamp'] = d.toString('YYYYMMDDHHMMSS');
        var data = JSON.stringify(return_json);
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, printResultFor('send'));
      });
    }, 10000);
  }
};

client.open(connectCallback);
