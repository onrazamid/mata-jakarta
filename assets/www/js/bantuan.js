$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

function successCallback(r) {
    console.log(r);
}

function onError(r) {
    console.log(r);
}

function onDeviceReady() {
    function speak(textspeak){
         TTS.speak({
             text: textspeak,
             locale: "id-ID",
             rate: 0.75
         }, function () {
             //alert('success');
         }, function (reason) {
             //alert(reason);
         });
    }

    speak("Menu : Meminta Bantuan sekitar. Ketuk 2 kali untuk memulai permintaan bantuan sekitar.");

    $(document).on("dblclick",function(){
        speak("Melakukan pencarian bantuan, mohon tunggu.");
        setTimeout(
          function()
          {
            navigator.vibrate(1000);
            $("result").html("Seorang petugas disekitar bernama Dimaz Arno bersedia membantu anda, goyangkan handphone anda untuk menghubunginya.");
            speak("Seorang petugas disekitar bernama Dimaz Arno bersedia membantu anda, goyangkan handphone anda untuk menghubunginya.");
          }, 6000);
          var onShake = function () {
            // Fired when a shake is detected
            navigator.vibrate(1000);
            window.plugins.CallNumber.callNumber(successCallback, onError, "0215855944", true);
            shake.stopWatch();
          };

          var onError = function () {
            // Fired when there is an accelerometer error (optional)
          };

          shake.startWatch(onShake, 40 /*, onError */);
    });

    function registerNav(){
            $(document).swipe( {
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                   $("#interrupt").text("");
                   $("#result").text("");
                   if (direction=="right") {
                        window.location = "portal.html";
                   }  else if (direction=="left") {
                        window.location = "index.html";
                   }
                }
            })
     }

     registerNav();
}