/////////////////////////
//  PHOTON CONTROLLER  //
/////////////////////////

require('dotenv').config();

var five = require("johnny-five"),
    Photon = require("particle-io"),
    request = require('request');


var board = new five.Board({
  io: new Photon({
    token: process.env.PHOTON_TOKEN,
    deviceId: process.env.PHOTON_DEVICE_ID
  })
});


board.on("ready", function() {
  console.log("Board Ready");

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
    });
  });

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("release", function() {
    endTime = Date.now();
    duration = endTime - startTime;
    console.log ( "End time was: ", endTime , "and duration is: ", duration );
  });
});
