var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morse = require('morse');

var letters = [],
  words = [],
  decodedWords = [];
dotsDashes = [];

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//////////////
//  ROUTES  //
//////////////

////////////////////
// HTML Endpoints //
////////////////////

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/dotsdashes', function(req, res) {
  res.send(dotsDashes);
});

app.get('/letters', function(req, res) {
  res.send(letters);
});

app.get('/words', function(req, res) {
  res.send(words);
});

app.get('/decodedwords', function(req, res) {
  res.send(decodedWords);
});

// redirect all other paths to index
app.get('*', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/////////////
// SERVER  //
/////////////

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Express server is running on http://localhost:3000/');
});


/////////////////////////
//  PHOTON CONTROLLER  //
/////////////////////////

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

  var led = new five.Led("D7"),
    button1 = new five.Button({
      pin: "D2",
      holdtime: 3000
    }),
    button2 = new five.Button({
      pin: "D0",
      holdtime: 1000
    }),
    startTime,
    endTime,
    pushDuration,
    letter = "",
    word = "";

  led.on();

  button1.on("press", function() {
    console.log("Button pressed");
    startTime = Date.now();
  });

  button1.on("hold", function() {
    decodedWords = morse.decode(words);
    console.log(decodedWords);
    dotsDashes = [];
    words = [];
  });

  button1.on("release", function() {
    endTime = Date.now();
    pushDuration = endTime - startTime;
    console.log("Push duration is: ", pushDuration);

    // Morse characters
    var dot = ".",
      dash = "-";

    // Letter constructor
    if (pushDuration > 3000) {
      letter = " ";
    } else if ((pushDuration > 500) && (pushDuration < 2999)) {
      letter += dash;
      console.log("Added DASH to letter: ", letter);
      dotsDashes.push(dash);

    } else {
      letter += dot;
      console.log("Added DOT to letter: ", letter);
      dotsDashes.push(dot);
    }

    button2.on("press", function() {
      word += letter;
      console.log("Added LETTER to word: ", letter);
      letters.push(letter);
      letter = " ";
      dotsDashes = [];
    });

    button2.on("hold", function() {
      if (word !== "") {
        console.log("Added WORD: ", word);
        words.push(word);
        word = " ";
        letter = "";
        letters = [];
      }
    });

  });

});
