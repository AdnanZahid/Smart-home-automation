$(document).ready(function() {
	socket.on("views/txt/voltageState.txt",function(voltageState) {
		$("#voltage").html(parseInt(voltageState)+" V");
	});
	socket.on("views/txt/currentState.txt",function(currentState) {
		$("#current").html(parseInt(currentState*100)/100+" A");
	});
	socket.on("views/txt/powerState.txt",function(powerState) {
		$("#power").html(parseInt(powerState)+" W");
	});
	socket.on("views/txt/energyState.txt",function(energyState) {
		$("#energy").html(parseInt(energyState)+" Wm");
	});
});