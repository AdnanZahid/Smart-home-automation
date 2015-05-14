$(document).ready(function(){
	
	$('#waterLimiter').noUiSlider({
		orientation: "vertical",
		start: 50,
		range: {
			min: 0,
			max: 100
		},
		start: [ 20, 80 ]
	});

	$('#waterLimiter').noUiSlider_pips({
		mode: 'values',
		values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
		density: 4
	});

	$('#waterLimiter').on('change', function (event, limits) {

        socket.emit("waterLimiterSet", limits);
	});

	$("#waterLimiter").Link('lower').to($("#lowerLimit"));

	$("#waterLimiter").Link('upper').to($("#upperLimit"));

	$(".noUi-value-vertical").html(function(index, currentContent){
    	return 100-currentContent;
    });

    socket.on("views/txt/waterLimitState.txt",function(waterLimitState) {
		var waterLimitStateArray = waterLimitState.split(",");
		$('#waterLimiter').val([100-waterLimitStateArray[0],100-waterLimitStateArray[1]]);
    });
});