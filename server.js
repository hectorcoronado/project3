require('dotenv').config();

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var controllers = require('./controllers');

//////////////
//  ROUTES  //
//////////////

////////////////////
// HTML Endpoints //
////////////////////

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
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


/////////////////////////
//  PHOTON CONTROLLER  //
/////////////////////////

require('dotenv').config();

var five = require("johnny-five"),
    Photon = require("particle-io");
    socketio = require("socket.io");

var board = new five.Board({
  io: new Photon({
    token: process.env.PHOTON_TOKEN,
    deviceId: process.env.PHOTON_DEVICE_ID
  })
});


board.on("ready", function() {
  console.log("Board Ready");

  var led = new five.Led("D7");
  led.on();

  var button = new five.Button("D2");

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
  });

  button.on("release", function() {
    console.log( "Buttton released" );
  });

});


var io = socketio.listen(server),
    pin = "D2";

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});
