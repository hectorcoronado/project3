$(document).on('ready', function() {
  console.log('app.js is loaded');

  setInterval(function(){
    $.get('/letters', function(data){
      $('#letter-target').html(data);
    });
  }, 500);


});

///////////////////////////////////
//  End $(document).on('ready')  //
///////////////////////////////////
