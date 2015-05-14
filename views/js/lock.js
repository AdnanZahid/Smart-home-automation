$(document).ready(function() {

  var lockStateInProgram = 1;

  $("#lock").live('click', function() {
    socket.emit("toggleLock", 1-lockStateInProgram, function(success){
      if(success) {
        if(lockStateInProgram == 1) {
          $('#lock').attr('src', '../images/locked.png');
          lockStateInProgram = 0;
        }
        else {
          $('#lock').attr('src', '../images/unlocked.png');
          lockStateInProgram = 1;
        }
      }
    });
  });

  socket.on("views/txt/lockState.txt",function(lockState) {

    if(lockState == 0) {
      $('#lock').attr('src', '../images/locked.png');
      lockStateInProgram = 0;
    }
    else {
      $('#lock').attr('src', '../images/unlocked.png');
      lockStateInProgram = 1;
    }
    lockStateInProgram = lockState;
  });
});