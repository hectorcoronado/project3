
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morse = require('morse');

var letters = [],
    words = [],
    phrases = [];

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//////////////
//  ROUTES  //
//////////////

////////////////////
// HTML Endpoints //
////////////////////

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/letters', function(req, res){
  res.send(letters);
});

// redirect all other paths to index
app.get('*', function homepage (req, res) {
 res.sendFile(__dirname + '/views/index.html');
});

////////////////////////
// JSON API Endpoints //
////////////////////////


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
  // events.push('ready');
  var led = new five.Led("D7"),
      button = new five.Button("D2"),
      startTime,
      endTime,
      pushDuration,
      timeBetweenPush,
      letter,
      word,
      phrase;

  led.on();

  button.on("press", function() {
    console.log( "Button pressed" );
    startTime = Date.now();
    timeBetweenPush = startTime - endTime;
    if ((timeBetweenPush > 2000 && letter !== "") && endTime !== null) {
      console.log ("You added a letter to your word: ", letter , "and time between pushes was: ", timeBetweenPush);
      word += word + letter + " ";
      letters.push(letter);
      letter = " ";
    }
  });

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("release", function() {
    endTime = Date.now();
    pushDuration = endTime - startTime;
    console.log ( "End time was: ", endTime , "and duration is: ", pushDuration );
    if ( pushDuration > 500 ) {
      letter += "-";
      console.log ( "You added a dash to your letter: ", letter);
    } else {
        letter += ".";
        console.log ( "You added a dot to your letter: ", letter);
    }

  });
});
