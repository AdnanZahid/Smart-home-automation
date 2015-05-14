$(document).ready(function(){

    var index = 0;

    var image1 = "url('images/water1.png')";
    var image2 = "url('images/water2.png')";

    var tapStateInProgram = 1;

    setInterval(function(){
        switch(index){
            case 0:
                $("#waterDrop").css("background-image", image1);
                index = 1;
                break;
            case 1:
                $("#waterDrop").css("background-image", image2);
                index = 0;
                break;
        }
    },200);

    socket.on("views/txt/tapState.txt",function(tapState) {

        if(tapState == 0) {
            image1 = "";
            image2 = "";
        }
        else {
            image1 = "url('images/water1.png')";
            image2 = "url('images/water2.png')";
        }
        tapStateInProgram = tapState;
    });

    socket.on("views/txt/waterState.txt",function(waterState) {

        waterState=(100-waterState)*4;

        $('.water').css('top', waterState+'px');
        $('.bubble_wrap').css('top', waterState+'px');
    });

    $("#waterDropBox").click(function(){

        socket.emit("toggleTap", 1-tapStateInProgram, function(success){
          if(success) {
            if(tapStateInProgram == 1) {
                image1 = "";
                image2 = "";
                tapStateInProgram = 0;
            }
            else {
                image1 = "url('images/water1.png')";
                image2 = "url('images/water2.png')";
                tapStateInProgram = 1;
            }
          }
        });
    });
});