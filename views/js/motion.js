$(document).ready(function() {
    socket.on("views/txt/motionState.txt", function(motionState) {
    	if(motionState == 1) {
			$("#motionWalk").css({
				animation:       'motionblur 1s ease-in-out',
				WebkitAnimation: 'motionblur 1s ease-in-out'
			});
		}
		else {
			$("#motionWalk").css({
				animation:       'none',
				WebkitAnimation: 'none'
			});
		}
    });
});