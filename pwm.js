var b = require('bonescript');
var fs = require('fs');
var SERVO = 'P9_16';

b.pinMode(SERVO, b.OUTPUT);

var dutyCycle = new Array();

dutyCycle[0] = 0;
dutyCycle[1] = 0.032;
dutyCycle[2] = 0.045;
dutyCycle[3] = 0.1;
dutyCycle[4] = 0.2;
dutyCycle[5] = 0.5;

while(1) {
	var fanState = fs.readFileSync("views/txt/fanState.txt", "utf8");
	b.analogWrite(SERVO, dutyCycle[fanState], 120);
}