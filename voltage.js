var b = require('bonescript');
b.analogRead('P9_40', printAIN1);

function printAIN1(x) {

//x.value=x.value*180;
//x.value=Math.round(x.value * 100) / 100;
console.log("value="+x.value);
console.log("volts="+x.value*1.800);
console.log("mains voltage="+x.value*1.800*157.98);
}                    