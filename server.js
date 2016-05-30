require('dotenv').config();

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var controllers = require('./controllers');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */




 // redirect all other paths to index
 app.get('*', function homepage (req, res) {
   res.sendFile(__dirname + '/views/index.html');
 });



/**********
 * SERVER *
 **********/

app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});


require('dotenv').config();

var five = require("johnny-five");

var Photon = require("particle-io");

var board = new five.Board({
  io: new Photon({
  token: process.env.PHOTON_TOKEN,
  deviceId: process.env.PHOTON_DEVICE_ID
  })
});

board.on("ready", function() {
  var laser = new five.Led("D7");
  var detection = new five.Sensor("A0");
  var isSecure = false;

  laser.on();

  detection.scale(0, 1).on("change", function() {
    var reading = !(this.value | 0);

    if (isSecure !== reading) {
      isSecure = reading;

      if (!isSecure) {
        console.log("Intruder");
      }
    }
  });
});
