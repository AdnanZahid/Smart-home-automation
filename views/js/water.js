try {
	$('.fishtank_wrap').ripples({
		resolution: 256,
		perturbance: 0.04
	});
}
catch (e) {
	$('.error').show().text(e);
}