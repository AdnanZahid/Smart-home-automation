var config = {
    openSocket: function(config) {

        var channel = config.channel || location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');
        var socket = new Firebase('https://webrtc.firebaseIO.com/' + channel);
        socket.channel = channel;
        socket.on("child_added", function(data) {
            config.onmessage && config.onmessage(data.val());
        });
        socket.send = function(data) {
            this.push(data);
        };
        config.onopen && setTimeout(config.onopen, 1);
        socket.onDisconnect().remove();
        return socket;
    },
    onRemoteStream: function(htmlElement) {
        htmlElement.setAttribute('controls', true);
        videosContainer.insertBefore(htmlElement, videosContainer.firstChild);
        htmlElement.play();
    },
    onRoomFound: function(room) {
        var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        document.getElementById('setup-new-broadcast').hidden = true;
        var tr = document.createElement('tr');
        tr.innerHTML = '<button class="join">Join</button>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        var joinRoomButton = tr.querySelector('.join');
        joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
        joinRoomButton.setAttribute('data-roomToken', room.broadcaster);
        joinRoomButton.onclick = function() {
            this.hidden = true;

            var broadcaster = this.getAttribute('data-broadcaster');
            var roomToken = this.getAttribute('data-roomToken');
            broadcastUI.joinRoom({
                roomToken: roomToken,
                joinUser: broadcaster
            });
        };
    }
};

function setupNewBroadcastButtonClickHandler() {
    document.getElementById('setup-new-broadcast').hidden = true;

    captureUserMedia(function() {
        var shared = 'video';
        if (window.option == 'Only Audio') {
            shared = 'audio';
        }
        if (window.option == 'Screen') {
            shared = 'screen';
        }
        
        broadcastUI.createRoom({
            roomName: 'Adnan',
            isAudio: shared === 'audio'
        });
    });
}

function captureUserMedia(callback) {
    var constraints = null;
    window.option = broadcastingOption ? broadcastingOption.value : '';
    if (option === 'Only Audio') {
        constraints = {
            audio: true,
            video: false
        };
        
        if(DetectRTC.hasMicrophone !== true) {
            alert('DetectRTC library is unable to find microphone; maybe you denied microphone access once and it is still denied or maybe microphone device is not attached to your system or another app is using same microphone.');
        }
    }
    if (option === 'Screen') {
        var video_constraints = {
            mandatory: {
                chromeMediaSource: 'screen'
            },
            optional: []
        };
        constraints = {
            audio: false,
            video: video_constraints
        };
        
        if(DetectRTC.isScreenCapturingSupported !== true) {
           alert('DetectRTC library is unable to find screen capturing support. You MUST run chrome with command line flag "chrome --enable-usermedia-screen-capturing"');
        }
    }
    
    if (option != 'Only Audio' && option != 'Screen' && DetectRTC.hasWebcam !== true) {
        alert('DetectRTC library is unable to find webcam; maybe you denied webcam access once and it is still denied or maybe webcam device is not attached to your system or another app is using same webcam.');
    }

    var htmlElement = document.createElement(option === 'Only Audio' ? 'audio' : 'video');
    htmlElement.setAttribute('autoplay', true);
    videosContainer.insertBefore(htmlElement, videosContainer.firstChild);

    var mediaConfig = {
        video: htmlElement,
        onsuccess: function(stream) {
            config.attachStream = stream;
            callback && callback();

            htmlElement.setAttribute('muted', true);
        },
        onerror: function() {
            if (option === 'Only Audio') alert('unable to get access to your microphone');
            else if (option === 'Screen') {
                if (location.protocol === 'http:') alert('Please test this WebRTC experiment on HTTPS.');
                else alert('Screen capturing is either denied or not supported. Are you enabled flag: "Enable screen capture support in getUserMedia"?');
            } else alert('unable to get access to your webcam');
        }
    };
    if (constraints) mediaConfig.constraints = constraints;
    getUserMedia(mediaConfig);
}

var broadcastUI = broadcast(config);

var videosContainer = document.getElementById('videos-container');
var setupNewBroadcast = document.getElementById('setup-new-broadcast');
var roomsList = document.getElementById('rooms-list');

var broadcastingOption = document.getElementById('broadcasting-option');

if (setupNewBroadcast) setupNewBroadcast.onclick = setupNewBroadcastButtonClickHandler;