$(document).ready(function() {
	var humidityGauge = new JustGage({
		id: "humidityGauge",
		value: 30,
		min: 0,
		max: 100,
		title: "Humidity"
	});

	socket.on("views/txt/humidityState.txt",function(humidityState) {

		humidityGauge.refresh(humidityState);
	});
});