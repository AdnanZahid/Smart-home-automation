$(document).ready(function() {

  var bulbStateInProgram = 1;

  $('#switch1').click(function() {
    socket.emit("toggleBulb", 1-bulbStateInProgram, function(success){
      if(success) {
        if(bulbStateInProgram == 1) {
          $('body').removeClass('night');
          bulbStateInProgram = 0;
          $('#switch1').prop('checked', false);
        }
        else {
          $('body').addClass('night');
          bulbStateInProgram = 1;
          $('#switch1').prop('checked', true);
        }
      }
    });
  });

  $('#bulbContainer').click(function() {
    socket.emit("toggleBulb", 1-bulbStateInProgram, function(success){
      if(success) {
        if(bulbStateInProgram == 1) {
          $('body').removeClass('night');
          bulbStateInProgram = 0;
          $('#switch1').prop('checked', false);
        }
        else {
          $('body').addClass('night');
          bulbStateInProgram = 1;
          $('#switch1').prop('checked', true);
        }
      }
    });
  });

  socket.on("views/txt/bulbState.txt",function(bulbState) {

    if(bulbState == 0) {
      $('body').removeClass('night');
      bulbStateInProgram = 0;
      $('#switch1').prop('checked', false);
    }
    else {
      $('body').addClass('night');
      bulbStateInProgram = 1;
      $('#switch1').prop('checked', true);
    }
    bulbStateInProgram = bulbState;
  });
});