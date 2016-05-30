$(document).on('ready', function() {
  console.log('app.js is loaded');

  var socket = io.connect('http://localhost:3000');

  socket.on('news', function(data){
    console.log(data);
  });


});

///////////////////////////////////
//  End $(document).on('ready')  //
///////////////////////////////////
