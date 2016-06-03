var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morse = require('morse');

var letters = [],
  words = [],
  decodedWords = [];

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

app.get('/letters', function(req, res) {
  res.send(letters);
});

app.get('/words', function(req, res) {
  res.send(words);
});

app.get('/decodedwords', function(req, res) {
  res.send(decodedwords);
});

// redirect all other paths to index
app.get('*', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

////////////////////////
// JSON API Endpoints //
////////////////////////


/////////////
// SERVER  //
/////////////

var server = app.listen(process.env.PORT || 3000, function() {
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
    timeBetweenPush,
    letter = "",
    word = "";

  led.on();

  button1.on("press", function() {
    console.log("Button pressed");

    startTime = Date.now();

    if (endTime) {
      timeBetweenPush = startTime - endTime;
    }

  });

  button1.on("hold", function() {
    decodedWords = morse.decode(words);
    console.log(decodedWords);
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
    if (pushDuration > 500) {
      letter += dash;
      console.log("You added a dash to your letter: ", letter);

    } else {
      letter += dot;
      console.log("You added a dot to your letter: ", letter);
    }

    // Word constructor
    if ((timeBetweenPush > 4000) && (word !== "")) {
      word += " ";
      console.log("Added WORD: ", word);
      console.log("TBP: ", timeBetweenPush);
      words.push(word);
      word = "";
      letter = "";
    } else if ((timeBetweenPush > 2000) && (letter !== "")) {
      word += letter;
      letter += " ";
      console.log("Added LETTER: ", letter, " to word");
      console.log("TBP: ", timeBetweenPush);
      letters.push(letter);
      letter = "";
    }

    button2.on("press", function(){
      letter += " ";
      word += letter;
      console.log("Added LETTER: ", letter, " to word");
      letters.push(letter);
    });

    button2.on("hold", function(){
      if (word !== ""){
        word += " ";
        console.log("Added WORD: ", word);
        console.log("TBP: ", timeBetweenPush);
        words.push(word);
        word = "";
        letter = "";
      }
    });

  });

});
