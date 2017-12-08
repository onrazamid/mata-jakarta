$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() {
    speak("Minimarket terdekat");
    $(document).swipe( {
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
           if (direction=="right"){
            window.location = "rumahsakit.html";
          } else {
            window.location = "index.html";
          }
        }
    });
}

function speak(textspeak){
    TTS.speak({
        text: textspeak,
        locale: "id-ID",
        rate: 0.75
    }, function () {
        //alert('success');
    }, function (reason) {
        alert(reason);
    });
}