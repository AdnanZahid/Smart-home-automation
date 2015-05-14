var startTimeStateArray = ["10","00","am"];
var stopTimeStateArray = ["12","00","pm"];

var startTime;
document.addEventListener('DOMContentLoaded', function(){

    startTime = new HexaFlip(document.getElementById('startTime'));
    startTime.setValue({ hour: startTimeStateArray[0], minute: startTimeStateArray[1], meridian: startTimeStateArray[2] });
}, false);

var stopTime;
document.addEventListener('DOMContentLoaded', function(){

    stopTime = new HexaFlip(document.getElementById('stopTime'));
    stopTime.setValue({ hour: stopTimeStateArray[0], minute: stopTimeStateArray[1], meridian: stopTimeStateArray[2] });
}, false);

$(document).ready(function(){

    socket.on("views/txt/startTimeState.txt",function(startTimeState) {
        startTimeStateArray = startTimeState.split(",");
        startTime.setValue({ hour: startTimeStateArray[0], minute: startTimeStateArray[1], meridian: startTimeStateArray[2] });
    });

    socket.on("views/txt/stopTimeState.txt",function(stopTimeState) {
        stopTimeStateArray = stopTimeState.split(",");
        stopTime.setValue({ hour: stopTimeStateArray[0], minute: stopTimeStateArray[1], meridian: stopTimeStateArray[2] });
    });

    $("#startButton").click(function(){
        socket.emit("startTimeSet", startTime.getValue());
    });

    $("#stopButton").click(function(){
        socket.emit("stopTimeSet", stopTime.getValue());
    });

    $("#startHourUp").click(function() {
        if(startTime.getValue()[0] < 12) {
            startTime.setValue({ hour: ++startTime.getValue()[0], minute: startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
        else {
            startTime.setValue({ hour: 1, minute: startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
    });
    $("#startMinuteUp").click(function() {
        if(startTime.getValue()[1] < 59) {
            startTime.setValue({ hour: startTime.getValue()[0], minute: ++startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
        else {
            startTime.setValue({ hour: ++startTime.getValue()[0], minute: 0, meridian: startTime.getValue()[2] });
        }
    });
    $("#startHourDown").click(function() {
        if(startTime.getValue()[0] > 0) {
            startTime.setValue({ hour: --startTime.getValue()[0], minute: startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
        else {
            startTime.setValue({ hour: 12, minute: startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
    });
    $("#startMinuteDown").click(function() {
        if(startTime.getValue()[1] > 0) {
            startTime.setValue({ hour: startTime.getValue()[0], minute: --startTime.getValue()[1], meridian: startTime.getValue()[2] });
        }
        else {
            startTime.setValue({ hour: --startTime.getValue()[0], minute: 59, meridian: startTime.getValue()[2] });
        }
    });
    $("#stopHourUp").click(function() {
        if(stopTime.getValue()[0] < 12) {
            stopTime.setValue({ hour: ++stopTime.getValue()[0], minute: stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
        else {
            stopTime.setValue({ hour: 1, minute: stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
    });
    $("#stopMinuteUp").click(function(){
        if(stopTime.getValue()[1] < 59) {
            stopTime.setValue({ hour: stopTime.getValue()[0], minute: ++stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
        else {
            stopTime.setValue({ hour: ++stopTime.getValue()[0], minute: 0, meridian: stopTime.getValue()[2] });
        }
    });
    $("#stopHourDown").click(function() {
        if(stopTime.getValue()[0] > 0) {
            stopTime.setValue({ hour: --stopTime.getValue()[0], minute: stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
        else {
            stopTime.setValue({ hour: 12, minute: stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
    });
    $("#stopMinuteDown").click(function() {
        if(stopTime.getValue()[1] > 0) {
            stopTime.setValue({ hour: stopTime.getValue()[0], minute: --stopTime.getValue()[1], meridian: stopTime.getValue()[2] });
        }
        else {
            stopTime.setValue({ hour: --stopTime.getValue()[0], minute: 59, meridian: stopTime.getValue()[2] });
        }
    });
});