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
    var curLat = 0;
    var curLng = 0;

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

     function speakEng(textspeak){
             TTS.speak({
                 text: textspeak,
                 locale: "en-US",
                 rate: 0.75
             }, function () {
                 //alert('success');
             }, function (reason) {
                 //alert(reason);
             });
         }
    //TTS.speak('', function () {alert('success');}, function (reason) {alert(reason);});
    speak("Menu: Informasi tempat wisata yang berada di Jakarta, ketuk 2 kali untuk memulai pembacaan informasi.");
    $("#dynmenu").html("<h3>Menu : Informasi tempat wisata yang berada di Jakarta.</h3><span>Ketuk 2 kali untuk memulai pembacaan informasi.</span>");

    $(document).on("dblclick",function(){
        speak("");
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });

    var onSuccess = function(position) {
        var arrSpk = [];
        var arrLat = [];
        var arrLng = [];

        curLat = position.coords.latitude;
        curLng = position.coords.longitude;

        $.ajax({
          url: "http://api.jakarta.go.id/v1/museum",
          headers: {
            Authorization: "LdT23Q9rv8g9bVf8v/fQYsyIcuD14svaYL6Bi8f9uGhLBVlHA3ybTFjjqe+cQO8k"
          },
          success: function(result) {
             //alert(result.data[0].nama_museum);
             var spkint=0;
             var delay = 0;

             $(count);
             var isStop = 0;
             function count(){
                if (spkint > 0){ delay = 40000; };
                $("#result").text(result.data[spkint].nama_museum).delay(delay).queue(function(n) {

                    spkint++;

                    $(this).text(result.data[spkint].nama_museum);
                    $("#interrupt").text(result.data[spkint].deskripsi);

                    isActiveOrder = 1;
                    if (isActiveOrder == 1){
                       $(document).swipe( {
                          swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                             //alert(direction);
                            if (direction=="right"){
                               isStop=1;
                               speak("");
                               //window.plugins.CallNumber.callNumber(successCallback, onError, arrCall[spkint], true);
                               registerNav();
                            } else if (direction=="left"){
                               isStop=1;
                               speak("");
                               speak("Anda memesan taksi online, mohon tunggu sebentar.");
                               //alert(arrLat[spkint]);
                               $.ajax({
                                   url: "https://api.uber.com/v1/estimates/price",
                                   headers: {
                                     Authorization: "Token b-D63SYDhOX6F-QvqvNyUvf8niLVA-883hOAKq5x"
                                   },
                                   data: {
                                     start_latitude: curLat,
                                     start_longitude: curLng,
                                     end_latitude: result.data[spkint].latitude,
                                     end_longitude: result.data[spkint].longitude
                                   },
                                   success: function(result) {
                                       //get uberX
                                       var info = "Estimasi harga "+result.prices[2].low_estimate+" hingga "+result.prices[2].high_estimate+" rupiah. Estimasi perjalanan "+ Math.ceil(result.prices[2].duration/60) +" menit. Untuk mengorder, goyangkan handphone anda.";
                                       $("#interrupt").text(info);
                                       speak(info);
                                       //alert(result.prices[2].display_name);
                                       console.log(JSON.stringify(result));

                                       var onShake = function () {
                                         // Fired when a shake is detected
                                         navigator.vibrate(1000);
                                         speak("Taksi online telah berhasil dipesan.");
                                         shake.stopWatch();
                                         registerNav();
                                       };

                                       var onError = function () {
                                         // Fired when there is an accelerometer error (optional)
                                       };

                                       shake.startWatch(onShake, 40 /*, onError */);
                                   }
                               });
                            }
                          }
                      });
                    }

                    if ((spkint <= result.count) && (isStop==0)) {
                         //speak(result.data[spkint].nama_museum);
                         speakEng(result.data[spkint].nama_museum+"."+result.data[spkint].deskripsi);
                         count();
                         n();
                         isActiveOrder=0;
                    } else {
                         n();
                         registerNav();
                    }
                });
             }
          }
        });
    }

     function registerNav(){
            $(document).swipe( {
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                   $("#interrupt").text("");
                   $("#result").text("");
                   if (direction=="right") {
                        window.location = "rumahsakit.html";
                   }  else if (direction=="left") {
                        window.location = "bantuan.html";
                   }
                }
            })
     }

     registerNav();
}