$(document).ready(function() {
	var luxGauge = new JustGage({
		id: "luxGauge",
		value: 200,
		min: 0,
		max: 400,
		title: "Lux",
		levelColors: ['#CE1B21', '#D0532A', '#FFC414', '#85A137', '#FFC414', '#D0532A', '#CE1B21']
	});

	socket.on("views/txt/luxState.txt",function(luxState) {

		luxGauge.refresh(luxState);
	});
});