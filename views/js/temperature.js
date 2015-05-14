$(document).ready(function() {
	socket.on("views/txt/tempState.txt",function(tempState) {
        
        if(tempState>=0) {
	        var tempStateFloor = Math.floor(tempState);
			$('.deneme').html(tempStateFloor+'<span>.'+Math.round((tempState-tempStateFloor)*10)+'</span><strong>&deg;</strong>');
        }
		else {
			tempState = Math.abs(tempState);
	        var tempStateFloor = Math.floor(tempState);
			$('.deneme').html('-'+tempStateFloor+'<span>.'+Math.round((tempState-tempStateFloor)*10)+'</span><strong>&deg;</strong>');
		}
    });
});