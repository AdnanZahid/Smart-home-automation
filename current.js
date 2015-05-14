var b = require('bonescript');
b.analogRead('P9_39', printAIN1);

function printAIN1(x) {

//x.value=x.value*180;
//x.value=Math.round(x.value * 100) / 100;
console.log("value="+x.value);
console.log("volts="+x.value*1.800);
console.log("current="+x.value*1.800*0.01301886792452830188679245283019*1000);
}                    