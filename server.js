
var express = require('express'),
    app = express();

var events = [];

app.use(express.static(__dirname + '/public'));


////////////////////
// HTML Endpoints //
////////////////////

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/events', function(req, res){
  res.send(events);
});

////////////////////////
// JSON API Endpoints //
////////////////////////


// redirect all other paths to index
app.get('*', function homepage (req, res) {
 res.sendFile(__dirname + '/views/index.html');
});


/////////////
// SERVER  //
/////////////

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});


// /////////////////////////
// //  PHOTON CONTROLLER  //
// /////////////////////////
//
require('dotenv').config();

var five = require("johnny-five"),
    Photon = require("particle-io");

var board = new five.Board({
  io: new Photon({
    token: process.env.PHOTON_TOKEN,
    deviceId: process.env.PHOTON_DEVICE_ID
  })
});

board.on("ready", function() {
  console.log("Board Ready");
  events.push('ready');
  var led = new five.Led("D7"),
      button = new five.Button("D2"),
      startTime,
      endTime,
      duration;

  led.on();

  button.on("press", function() {
    console.log( "Button pressed" );
    startTime = Date.now();
    request.post('https://ping-me-johnny.herokuapp.com/pings', function(){
      console.log('ping...');
      events.push('pressed');
    });
  });

  button.on("hold", function() {
    console.log( "Button held" );
    events.push('held');
  });

  button.on("release", function() {
    endTime = Date.now();
    duration = endTime - startTime;
    console.log ( "End time was: ", endTime , "and duration is: ", duration );
    events.push('released');
  });

});
