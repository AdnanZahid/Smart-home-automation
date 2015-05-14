var b = require('bonescript');
var fs= require('fs');
var bulbPin = 'P8_10';
var fanPin = 'P8_12';
var fanUpPin = 'P8_14';
var fanDownPin = 'P8_16';

b.pinMode(bulbPin, b.INPUT);
b.pinMode(fanPin, b.INPUT);
b.pinMode(fanUpPin, b.INPUT);
b.pinMode(fanDownPin, b.INPUT);

b.attachInterrupt(bulbPin, true, b.RISING, bulb);
b.attachInterrupt(fanPin, true, b.RISING, fan);
b.attachInterrupt(fanUpPin, true, b.RISING, fanUp);
b.attachInterrupt(fanDownPin, true, b.RISING, fanDown);

function bulb(x) {
	console.log('bulb'); 
	var bulbState = fs.readFileSync("/var/www/FYP/views/txt/bulbState.txt", "utf8");
    fs.writeFileSync("/var/www/FYP/views/txt/bulbState.txt", 1-bulbState); 
}

function fan(x) {
	console.log('fan'); 
	var fanState = fs.readFileSync("/var/www/FYP/views/txt/fanSwitchState.txt", "utf8");
    fs.writeFileSync("/var/www/FYP/views/txt/fanSwitchState.txt", 1-fanState); 
}

function fanUp(x) {
	console.log('fan up'); 
	var fanUp = fs.readFileSync("/var/www/FYP/views/txt/fanState.txt", "utf8");
		console.log(fanUp); 

	if(fanUp!=5){
	fanUp=parseInt(fanUp)+1;
    fs.writeFileSync("/var/www/FYP/views/txt/fanState.txt", fanUp); 
	}
}

function fanDown(x) {
	console.log('fan down'); 
	var fanDown = fs.readFileSync("/var/www/FYP/views/txt/fanState.txt", "utf8");
	if(fanDown!=0){
	fanDown=parseInt(fanDown)-1;
    fs.writeFileSync("/var/www/FYP/views/txt/fanState.txt", fanDown);
	}
}