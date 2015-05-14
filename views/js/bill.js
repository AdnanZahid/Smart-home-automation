$(document).ready(function() {

	$.jqplot.config.enablePlugins = true;
	$.jqplot._noToImageButton = true;
			  
	var opts = {
	  title: "Usage",
	  axes: {
	      xaxis: {
	      	label:'Time',
	        renderer:$.jqplot.DateAxisRenderer
	      },
	      yaxis: {
	      	label:'Units: Wm',
	      }
	  },
	  cursor:{zoom:true}
	};

	chart = $.jqplot('graph', [[0,0]], opts);

	socket.on("plotGraph",function(graphDataArray) {
		if (chart) {
            chart.destroy();
        }
		chart = $.jqplot('graph', [graphDataArray], opts);

		socket.on("latestValue",function(energyState) {
			if (chart) {
	            chart.destroy();
	        }
	        graphDataArray.push(energyState);
			chart = $.jqplot('graph', [graphDataArray], opts);
		});
	});

	chart.target.bind('jqplotZoom', function(ev, gridpos, datapos, plot, cursor){
		var total = 0;
        var plotData =  plot.series[0].data;
        for (var i=0; i< plotData.length; i++) {
            if(plotData[i][0] >= chart.axes.xaxis.min && plotData[i][0] <= chart.axes.xaxis.max ) {
                total += plotData[i][1];
            }
        }
        $("#stats").html("Bill = (1.3 Rs/Unit)*Units = Rs "+parseInt(1.3*total)+" for "+parseInt(total)+" Wm units");
	});
});