var express      = require('express');
var app          = express();
var http         = require('http');
var io           = require('socket.io');
var sys          = require('sys');
var exec         = require('child_process').exec;
var fs           = require('fs');
var chokidar     = require('chokidar');
var port         = process.env.PORT || 80;
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var configDB     = require('./config/database.js');
var schedule     = require('node-schedule');
var moment       = require('moment');
// var b 			 = require('bonescript');
var thisSocket;

var BULBPIN = 'P9_12';
var FANPIN = 'P9_14';
var PWMPIN = 'P9_16';
var LOCKPIN = 'P9_30';
var CURRENTSENSEPIN = 'P9_39';
var VOLTAGESENSEPIN = 'P9_40';

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'views')));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({ secret: 'smarthome' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

var server = http.createServer(app).listen(port);
io = io.listen(server);

function puts(error, stdout, stderr) {
    sys.puts(stdout);
    
    var ack_to_client = {
        data: stdout
    }
    thisSocket.send(JSON.stringify(ack_to_client));
}

function getTime() {

    var time = moment().format("hhmmss");
    return time;
}

function getTimeStamp() {

    var time = moment().format("MMM D YYYY, h:m:s a");
    return time;
}

var Schema = mongoose.Schema;
var BillSchema = new Schema({
    timeStamp: String,
    units: Number
});

var Bill = mongoose.model('bill', BillSchema);

// b.pinMode(BULBPIN, b.OUTPUT);
// b.pinMode(FANPIN, b.OUTPUT);
// b.pinMode(PWMPIN, b.OUTPUT);
// b.pinMode(LOCKPIN, b.OUTPUT);

// setInterval(function() {
//     setTimeout(function(){b.analogRead(VOLTAGESENSEPIN, voltage);},100);
// }, 1000);

// setInterval(function() {
//     setTimeout(function(){b.analogRead(CURRENTSENSEPIN, current);},200);
// }, 1000);

function voltage(x) {
    // 1.8*158
    fs.writeFileSync("views/txt/voltageState.txt", x.value*284.4);
}
function current(x) {
    // 1.8*0.00475*1000
    fs.writeFileSync("views/txt/currentState.txt", x.value*9.2);
}

var dutyCycle = new Array();

dutyCycle[0] = 0;
dutyCycle[1] = 0.032;
dutyCycle[2] = 0.045;
dutyCycle[3] = 0.1;
dutyCycle[4] = 0.2;
dutyCycle[5] = 0.5;

// chokidar.watch('views/txt/fanState.txt', {
//     persistent: true,
// }).on('change', function(file) {
//     var fanState = fs.readFileSync("views/txt/fanState.txt", "utf8");
//     b.analogWrite(PWMPIN, dutyCycle[fanState], 120);
// });

var bulbState = fs.readFileSync("views/txt/bulbState.txt", "utf8");
var currentState = fs.readFileSync("views/txt/currentState.txt", "utf8");
var energyState = fs.readFileSync("views/txt/energyState.txt", "utf8");
var fanState = fs.readFileSync("views/txt/fanState.txt", "utf8");
var fanSwitchState = fs.readFileSync("views/txt/fanSwitchState.txt", "utf8");
var humidityState = fs.readFileSync("views/txt/humidityState.txt", "utf8");
var luxState = fs.readFileSync("views/txt/luxState.txt", "utf8");
var motionState = fs.readFileSync("views/txt/motionState.txt", "utf8");
var powerState = fs.readFileSync("views/txt/powerState.txt", "utf8");
var smokeState = fs.readFileSync("views/txt/smokeState.txt", "utf8");
var startTimeState = fs.readFileSync("views/txt/startTimeState.txt", "utf8");
var stopTimeState = fs.readFileSync("views/txt/stopTimeState.txt", "utf8");
var tapState = fs.readFileSync("views/txt/tapState.txt", "utf8");
var tempState = fs.readFileSync("views/txt/tempState.txt", "utf8");
var voltageState = fs.readFileSync("views/txt/voltageState.txt", "utf8");
var waterLimitState = fs.readFileSync("views/txt/waterLimitState.txt", "utf8");
var waterState = fs.readFileSync("views/txt/waterState.txt", "utf8");
var lockState = fs.readFileSync("views/txt/lockState.txt", "utf8");

// setTimeout(function(){b.digitalWrite(BULBPIN, bulbState);},400);
// setTimeout(function(){b.analogWrite(PWMPIN, dutyCycle[fanState], 120);},500);
// setTimeout(function(){b.digitalWrite(FANPIN, fanSwitchState);},600);
// setTimeout(function(){b.digitalWrite(LOCKPIN, 0);},700);

io.sockets.on("connection",function(socket) {

var bulbState = fs.readFileSync("views/txt/bulbState.txt", "utf8");
var currentState = fs.readFileSync("views/txt/currentState.txt", "utf8");
var energyState = fs.readFileSync("views/txt/energyState.txt", "utf8");
var fanState = fs.readFileSync("views/txt/fanState.txt", "utf8");
var fanSwitchState = fs.readFileSync("views/txt/fanSwitchState.txt", "utf8");
var humidityState = fs.readFileSync("views/txt/humidityState.txt", "utf8");
var luxState = fs.readFileSync("views/txt/luxState.txt", "utf8");
var motionState = fs.readFileSync("views/txt/motionState.txt", "utf8");
var powerState = fs.readFileSync("views/txt/powerState.txt", "utf8");
var smokeState = fs.readFileSync("views/txt/smokeState.txt", "utf8");
var startTimeState = fs.readFileSync("views/txt/startTimeState.txt", "utf8");
var stopTimeState = fs.readFileSync("views/txt/stopTimeState.txt", "utf8");
var tapState = fs.readFileSync("views/txt/tapState.txt", "utf8");
var tempState = fs.readFileSync("views/txt/tempState.txt", "utf8");
var voltageState = fs.readFileSync("views/txt/voltageState.txt", "utf8");
var waterLimitState = fs.readFileSync("views/txt/waterLimitState.txt", "utf8");
var waterState = fs.readFileSync("views/txt/waterState.txt", "utf8");
var lockState = fs.readFileSync("views/txt/lockState.txt", "utf8");

// setTimeout(function(){b.digitalWrite(BULBPIN, bulbState); socket.emit("views/txt/bulbState.txt", bulbState);},400);
// setTimeout(function(){b.analogWrite(PWMPIN, dutyCycle[fanState], 120); socket.emit("views/txt/fanState.txt", fanState);},500);
// setTimeout(function(){b.digitalWrite(FANPIN, fanSwitchState); socket.emit("views/txt/fanSwitchState.txt", fanSwitchState);},600);
// setTimeout(function(){b.digitalWrite(LOCKPIN, 0); socket.emit("views/txt/lockState.txt", 0);},700);

	setInterval(function() {
	    setTimeout(function(){
	        var currentState = parseFloat(fs.readFileSync("views/txt/currentState.txt", "utf8"));
	        var voltageState = parseFloat(fs.readFileSync("views/txt/voltageState.txt", "utf8"));
            var powerState = currentState*voltageState;
            var energyState = (powerState*2)/60;

            socket.emit("latestValue", [getTimeStamp(), energyState]);
	        Bill.create({timeStamp: getTimeStamp(), units: energyState});
	        var previousEnergy = parseFloat(fs.readFileSync("views/txt/energyState.txt", "utf8"));
            if(!isNaN(previousEnergy)) {
	            var energyState = previousEnergy+energyState;
        	}
        	else {
        		var energyState = 0;
        	}

            fs.writeFileSync("views/txt/powerState.txt", powerState);
            fs.writeFileSync("views/txt/energyState.txt", energyState);
	    },300);
	}, 2000);

    setTimeout(function(){socket.emit("views/txt/bulbState.txt", bulbState);},100);
    setTimeout(function(){socket.emit("views/txt/currentState.txt", currentState);},200);
    setTimeout(function(){socket.emit("views/txt/energyState.txt", energyState);},300);
    setTimeout(function(){socket.emit("views/txt/fanState.txt", fanState);},400);
    setTimeout(function(){socket.emit("views/txt/fanSwitchState.txt", fanSwitchState);},500);
    setTimeout(function(){socket.emit("views/txt/humidityState.txt", humidityState);},600);
    setTimeout(function(){socket.emit("views/txt/luxState.txt", luxState);},700);
    setTimeout(function(){socket.emit("views/txt/motionState.txt", motionState);},800);
    setTimeout(function(){socket.emit("views/txt/powerState.txt", powerState);},900);
    setTimeout(function(){socket.emit("views/txt/smokeState.txt", smokeState);},1000);
    setTimeout(function(){socket.emit("views/txt/startTimeState.txt", startTimeState);},1100);
    setTimeout(function(){socket.emit("views/txt/stopTimeState.txt", stopTimeState);},1200);
    setTimeout(function(){socket.emit("views/txt/tapState.txt", tapState);},1300);
    setTimeout(function(){socket.emit("views/txt/tempState.txt", tempState);},1400);
    setTimeout(function(){socket.emit("views/txt/voltageState.txt", voltageState);},1500);
    setTimeout(function(){socket.emit("views/txt/waterLimitState.txt", waterLimitState);},1600);
    setTimeout(function(){socket.emit("views/txt/waterState.txt", waterState);},1700);
    setTimeout(function(){socket.emit("views/txt/lockState.txt", 0);},1800);

    setInterval(function() {
        setTimeout(function(){socket.emit("time", getTime());},500);
    }, 1000);

    // START TIME JOB
    var startTimeStateArray = startTimeState.split(",");
    var startTimeRule = new schedule.RecurrenceRule();
    
    var hour = parseInt(startTimeStateArray[0]);
    if(startTimeStateArray[2] == "pm")
        hour = hour + 12;

    startTimeRule.hour = startTimeStateArray[0];
    startTimeRule.minute = startTimeStateArray[1];

    var startTimeSchedule = schedule.scheduleJob(startTimeRule, function(){
        fs.writeFileSync("views/txt/bulbState.txt", 1);
    });

    // STOP TIME JOB
    var stopTimeStateArray = stopTimeState.split(",");
    var stopTimeRule = new schedule.RecurrenceRule();

    var hour = parseInt(stopTimeStateArray[0]);
    if(stopTimeStateArray[2] == "pm")
        hour = hour + 12;
    
    stopTimeRule.hour = stopTimeStateArray[0];
    stopTimeRule.minute = stopTimeStateArray[1];

    var stopTimeSchedule = schedule.scheduleJob(stopTimeRule, function(){
        fs.writeFileSync("views/txt/bulbState.txt", 0);
    });

    chokidar.watch('views/txt', {
        persistent: true,
    }).on('change', function(file) {
        socket.emit(file, fs.readFileSync(file, "utf8"));
    });

    // chokidar.watch('views/txt/bulbState.txt', {
    //     persistent: true,
    // }).on('change', function(file) {
    //     b.digitalWrite(BULBPIN, fs.readFileSync(file, "utf8"));
    // });

    // chokidar.watch('views/txt/lockState.txt', {
    //     persistent: true,
    // }).on('change', function(file) {
    //     b.digitalWrite(LOCKPIN, fs.readFileSync(file, "utf8"));
    //     if(fs.readFileSync(file, "utf8") == 1) {
    //         setTimeout(function(){fs.writeFileSync(file, 0);},500);
    //     }
    // });

    // chokidar.watch('views/txt/fanSwitchState.txt', {
    //     persistent: true,
    // }).on('change', function(file) {
    //     b.digitalWrite(FANPIN, fs.readFileSync(file, "utf8"));
    // });

    chokidar.watch('views/txt/startTimeState.txt', {
        persistent: true,
    }).on('change', function(file) {
        startTimeState = fs.readFileSync("views/txt/startTimeState.txt", "utf8");
        // START TIME JOB
        var startTimeStateArray = startTimeState.split(",");
        var startTimeRule = new schedule.RecurrenceRule();
    
        var hour = parseInt(startTimeStateArray[0]);
        if(startTimeStateArray[2] == "pm")
            hour = hour + 12;
        
        startTimeRule.hour = startTimeStateArray[0];
        startTimeRule.minute = startTimeStateArray[1];

        var startTimeSchedule = schedule.scheduleJob(startTimeRule, function(){
            fs.writeFileSync("views/txt/bulbState.txt", 1);
        });
    });

    chokidar.watch('views/txt/stopTimeState.txt', {
        persistent: true,
    }).on('change', function(file) {
        stopTimeState = fs.readFileSync("views/txt/stopTimeState.txt", "utf8");
        // STOP TIME JOB
        var stopTimeStateArray = stopTimeState.split(",");
        var stopTimeRule = new schedule.RecurrenceRule();

        var hour = parseInt(stopTimeStateArray[0]);
        if(stopTimeStateArray[2] == "pm")
            hour = hour + 12;
        
        stopTimeRule.hour = stopTimeStateArray[0];
        stopTimeRule.minute = stopTimeStateArray[1];

        var stopTimeSchedule = schedule.scheduleJob(stopTimeRule, function(){
            fs.writeFileSync("views/txt/bulbState.txt", 0);
        });
    });

    Bill.count(function (err, currentCount) {

        Bill.find(function (err, graphData) {

            var graphDataArray = [];
            for(graphPoint in graphData) {

                graphDataArray.push([graphData[graphPoint].timeStamp, graphData[graphPoint].units]);
            }
            socket.emit("plotGraph", graphDataArray);
        });
    });

    socket.on("toggleBulb", function(data, success) {
        fs.writeFileSync("views/txt/bulbState.txt", data);
        success(true);
    });

    socket.on("toggleTap", function(data, success) {
        fs.writeFileSync("views/txt/tapState.txt", data);
        success(true);
    });

    socket.on("toggleFan", function(data, success) {
        fs.writeFileSync("views/txt/fanSwitchState.txt", data);
        success(true);
    });

    socket.on("toggleLock", function(data, success) {
        fs.writeFileSync("views/txt/lockState.txt", data);
        success(true);
    });

    socket.on("regulateFan", function(data, success) {
        fs.writeFileSync("views/txt/fanState.txt", data);
        success(true);
    });

    socket.on("smokeOff", function(data, success) {
        fs.writeFileSync("views/txt/smokeState.txt", 0);
        success(true);
    });

    socket.on("waterLimiterSet",function(limits) {
        var upperLimit = 100-limits[0];
        var lowerLimit = 100-limits[1];
        fs.writeFileSync("views/txt/waterLimitState.txt", upperLimit+','+lowerLimit);
    });

    socket.on("startTimeSet",function(time) {
        fs.writeFileSync("views/txt/startTimeState.txt", time[0]+','+time[1]+','+time[2]);
    });

    socket.on("stopTimeSet",function(time) {
        fs.writeFileSync("views/txt/stopTimeState.txt", time[0]+','+time[1]+','+time[2]);
    });
});