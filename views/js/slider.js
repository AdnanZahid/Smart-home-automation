$(document).ready(function() {

  $("#volume").slider({
    min: 0,
    max: 100,
    value: 0,
		range: "min",
		animate: true,
    slide: function(event, ui) {
      setVolume((ui.value) / 100);
    }
  });
});

function setVolume(myVolume) {
  
}