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
