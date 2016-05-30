$(document).on('ready', function() {
  console.log('app.js is loaded');


  var clicks = 0;

  $('#counter').on('click', 'button', function(){
    clicks +=1;
    console.log(clicks);
    return clicks;
  });

});

///////////////////////////////////
//  End $(document).on('ready')  //
///////////////////////////////////




require('dotenv').config();

var five = require("johnny-five");

var Photon = require("particle-io");
// Particle-io is a Firmata-compatibility IO class for writing node programs that interact with Particle devices

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
