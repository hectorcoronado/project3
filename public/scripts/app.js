$(document).on('ready', function() {
  console.log('app.js is loaded');

  setInterval(function(){
    $.get('/events', function(data){
      $('#target').html(data);
    });
  }, 1000);


});

///////////////////////////////////
//  End $(document).on('ready')  //
///////////////////////////////////
