$(document).ready(function() {

	var smokeAlarm;
	var smokeVisual;

	function showSmokeDialog() {
	    $("#smokeDialog").html("Turn off smoke alarm?");

	    $("#smokeDialog").dialog({
	        resizable : false,
	        modal: false,
	        buttons: {
	            "Turn off!": function () {
	            	socket.emit("smokeOff", null, function(success){
			          if(success) {
		                $("#smokeDialog").dialog('close');
			          }
			        });
	            }
	        }
	    });
	}

    socket.on("views/txt/smokeState.txt",function(smokeState) {

	    smokeAlarm = document.getElementById('smokePlayer');
	    smokeVisual = document.getElementById('smoke_wrap');

        if(smokeState == 1) {
            smokeAlarm.play();
            smokeVisual.style.display = "block";

            showSmokeDialog();
        }
        else {
            smokeAlarm.pause();
			smokeAlarm.currentTime = 0;
            smokeVisual.style.display = "none";
            $("#smokeDialog").dialog().dialog('close');
        }
    });

	if(!$.browser.msie){
		var a=0;for(;a<15;a+=1){setTimeout(function b(){var a=Math.random()*1e3+5e3,c=$("<div />",{"class":"smoke",css:{opacity:0,left:0}});$(c).appendTo("#smoke_effect_area");$.when($(c).animate({opacity:1},{duration:a/4,easing:"easeOutCubic",queue:false,complete:function(){$(c).animate({opacity:0},{duration:a/3,easing:"easeOutCubic",queue:false})}}),$(c).animate({bottom:-$("#smoke_effect_area").height()},{duration:a,easing:"easeOutCubic",queue:false})).then(function(){$(c).remove();b()})},Math.random()*3e3)}
	}else{		
	"use strict";var a=0;for(;a<15;a+=1){setTimeout(function b(){var a=Math.random()*1e3+5e3,c=$("<div />",{"class":"smoke",css:{left:0}});$(c).appendTo("#smoke_effect_area");$.when($(c).animate({},{duration:a/4,easing:"easeOutCubic",queue:false,complete:function(){$(c).animate({},{duration:a/3,easing:"easeOutCubic",queue:false})}}),$(c).animate({bottom:-$("#smoke_effect_area").height()},{duration:a,easing:"easeOutCubic",queue:false})).then(function(){$(c).remove();b()})},Math.random()*3e3)}}}())