$(document).ready(function() {
	socket.on("views/txt/fanState.txt",function(fanState) {

		var bars = $('#bars');
		var colorBars = bars.find('.colorBar');

		var numBars = fanState*6;

		var timeOneRotation = 6.2 - numBars*0.2;
		colorBars.removeClass('active').slice(0, numBars).addClass('active');

		var fanStateInProgram = 1;

		socket.on("views/txt/fanSwitchState.txt",function(fanState) {
			if(fanState == 0) {
				$('.blades').css({
					animation:      'none',
					MozAnimation:   'none',
					WebkitAnimation:'none',
					OAnimation:     'none',
					MsAnimation:    'none'
				});
				fanStateInProgram = 0;
				$('#switch2').prop('checked', false);
			}
			else {
				$('.blades').css({
					animation:      'spin '+timeOneRotation+'s linear infinite',
					MozAnimation:   'spin '+timeOneRotation+'s linear infinite',
					WebkitAnimation:'spin '+timeOneRotation+'s linear infinite',
					OAnimation:     'spin '+timeOneRotation+'s linear infinite',
					MsAnimation:    'spin '+timeOneRotation+'s linear infinite'
				});
				fanStateInProgram = 1;
				$('#switch2').prop('checked', true);
			}
			fanStateInProgram = fanState;
		});

		$('#switch2').click(function() {
			socket.emit("toggleFan", 1-fanStateInProgram, function(success){
			  if(success) {
			    if(fanStateInProgram == 1) {
			      $('.blades').css({
			        animation:      'none',
			        MozAnimation:   'none',
			        WebkitAnimation:'none',
			        OAnimation:     'none',
			        MsAnimation:    'none'
			      });
			      fanStateInProgram = 0;
			      $('#switch2').prop('checked', false);
			    }
			    else {
					$('.blades').css({
						animation:      'spin '+timeOneRotation+'s linear infinite',
						MozAnimation:   'spin '+timeOneRotation+'s linear infinite',
						WebkitAnimation:'spin '+timeOneRotation+'s linear infinite',
						OAnimation:     'spin '+timeOneRotation+'s linear infinite',
						MsAnimation:    'spin '+timeOneRotation+'s linear infinite'
					});
			      fanStateInProgram = 1;
			      $('#switch2').prop('checked', true);
			    }
			  }
			});
		});
	});
});