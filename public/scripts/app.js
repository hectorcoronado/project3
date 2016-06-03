$(document).on('ready', function() {
  console.log('app.js is loaded');


  setInterval(function(){

    $.get('/dotsdashes', function(data){
      $('#dotsdashes-target').html(data);
    });

    $.get('/letters', function(data){
      $('#letter-target').html(data);
    });

    $.get('/words', function(data){
      $('#word-target').html(data);
    });

    $.get('/decodedwords', function(data){
      $('#decoded-target').html(data);
    });

  }, 200);



});

///////////////////////////////////
//  End $(document).on('ready')  //
///////////////////////////////////
