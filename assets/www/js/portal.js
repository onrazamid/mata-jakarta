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
    var rssberita = {"count":2,"data":[{"judul":"Ketika Anak-anak Tuna Netra Menyentuh Museum Nasional","isi":"Tidak bisa melihat, bukan artinya anak-anak tuna netra tidak bisa berwisata ke Museum Nasional. Mereka menikmati museum ini lewat sentuhan tangan. Inilah bukti kalau traveling adalah hak asasi semua orang. Keterbatasan penglihatan yang dimiliki anak tuna netra tidak menyurutkan semangat mereka saat berwisata menjelajah museum. Buktinya hari ini, 17 anak tuna netra bisa menikmati Museum Nasional dengan cara menyentuh. Museum adalah salah satu tujuan favorit untuk agenda study tour, mengingat banyaknya informasi sejarah yang penting diketahui anak-anak. Rasa penasaran yang sama juga melanda anak-anak tuna netra, yang memiliki keterbatasan penglihatan. Tapi mereka tak mau ketinggalan. Hari ini, 17 anak tuna netra bersama komunitas Museum Ceria menjelajahi Museum Nasional (Munas) di Jakarta Pusat. Mereka menjelajah museum bukan dengan melihat, melainkan dengan menyentuh."},{"judul":"Ketua Pertuni DKI ke Anies: Saya Gubernur Tuna Netra Pak","isi":"Ketua Persatuan Tuna Netra Indonesia (Pertuni) DKI Jakarta, Eka Setiawan, memberi sambutan di acara Peringatan Hari Disabilitas Internasional (HDI) Tingkat Provinsi DKI Jakarta Tahun 2017. Dia sempat berkelakar ke Gubernur DKI Jakarta Anies Baswedan.Pak Anies, mohon maaf Pak microphone-nya saya pakai dulu, kata Eka yang juga penyandang disabilitas sensorik di lokasi acara di Panti Sosial Bina Grahita Belaian Kasih, Kalideres, Jakarta Barat, Rabu (6/12/2017).Dalam sambutannya, Eka berkelakar dengan menyebut dirinya sebagai gubernur tuna netra. Ia berharap, antara Anies sebagai Gubernur DKI dengan dirinya yang merupakan gubernur tuna netra dapat terjalin sinergitas."}]};
    $("#result").html("");

    var swipe_v = "home";

    var isActiveOrder = 0;
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
                 alert(reason);
             });
         }
    //TTS.speak('', function () {alert('success');}, function (reason) {alert(reason);});
    speak("Menu : Portal Informasi, pilih submenu dengan menggeser layar ke atas atau ke bawah.");
    $("#dynmenu").html("<h3>Menu : Portal Informasi</h3>");

    $(document).on("dblclick",function(){
        if (swipe_v == "berita"){
             $("#result").html("");
             speak("");
             //speak("Memulai membaca informasi terbaru.");
             var spkint = 0;
             var delay = 0;
             var isStop = 0;
             $(countnews);

             function countnews(){
                if (spkint > 0){ delay = 15000; };
                $("#result").text(rssberita.data[spkint].judul).delay(delay).queue(function(n) {

                    spkint++;

                    $(this).text(rssberita.data[spkint].judul);
                    $("#interrupt").text(rssberita.data[spkint].isi);

                    isActiveOrder = 1;
                    if (isActiveOrder == 1){
                       $(document).swipe( {
                          swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                             //alert(direction);
                            if (direction=="right"){
                               isStop=1;
                               speak(rssberita.data[spkint].isi);
                               //window.plugins.CallNumber.callNumber(successCallback, onError, arrCall[spkint], true);
                               registerNav();
                            } else if (direction=="left"){
                               registerNav();
                            }
                          }
                      });
                    }

                    if ((spkint <= rssberita.count) && (isStop==0)) {
                         //speak(result.data[spkint].nama_museum);
                         speak(rssberita.data[spkint].judul+". Geser ke kanan untuk membaca lebih detail artikel ini.");
                         countnews();
                         n();
                         isActiveOrder=0;
                    } else {
                         n();
                         registerNav();
                    }
                });
             }
          }

          if (swipe_v == "wisata"){
            speak("");
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
          }
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
                if (swipe_v == "home") {
                    if (direction=="right") {
                         window.location = "rumahsakit.html";
                    }  else if (direction=="left") {
                         window.location = "bantuan.html";
                    } else if (direction == "up"){
                         swipe_v = "berita";
                         $("#hands").attr("src","img/atasbawah.png");
                         speak("Submenu : Informasi berita terbaru. Ketuk 2 kali untuk memulai.");
                         $("#dynmenu").html("<h3>Menu : Portal Informasi</h3><h4>Submenu: Informasi berita terbaru. </h4><span>Ketuk 2 kali untuk memulai</span>");
                    }
                    return false;
                }
                if (swipe_v == "berita"){
                     speak("Submenu : Informasi berita terbaru. Ketuk 2 kali untuk memulai.");
                     $("#dynmenu").html("<h3>Menu : Portal Informasi</h3><h4>Submenu: Informasi berita terbaru. </h4><span>Ketuk 2 kali untuk memulai</span>");
                     if (direction == "up"){
                          swipe_v = "wisata";
                          $("#hands").attr("src","img/atasbawah.png");
                          speak("Submenu: Informasi tempat wisata yang berada di Jakarta, ketuk 2 kali untuk memulai pembacaan informasi.");
                          $("#dynmenu").html("<h3>Menu : Portal Informasi</h3><h4>Submenu: Informasi tempat wisata yang berada di Jakarta. </h4><span>Ketuk 2 kali untuk memulai pembacaan informasi.</span>");
                     } else if (direction == "down"){
                         swipe_v = "home";
                         $("#hands").attr("src","img/kkab.png");
                         speak("Menu : Portal Informasi, pilih submenu dengan menggeser layar ke atas atau ke bawah.");
                         $("#dynmenu").html("<h3>Menu : Portal Informasi</h3>");
                     }
                     return false;
                }
                if (swipe_v == "wisata"){
                    speak("Submenu: Informasi tempat wisata yang berada di Jakarta, ketuk 2 kali untuk memulai pembacaan informasi.");
                    $("#dynmenu").html("<h3>Menu : Portal Informasi</h3><h4>Submenu: Informasi tempat wisata yang berada di Jakarta. </h4><span>Ketuk 2 kali untuk memulai pembacaan informasi.</span>");
                    if (direction == "up"){
                         swipe_v = "home";
                         $("#hands").attr("src","img/kkab.png");
                         speak("Menu : Portal Informasi, pilih submenu dengan menggeser layar ke atas atau ke bawah.");
                         $("#dynmenu").html("<h3>Menu : Portal Informasi</h3>");
                    } else if (direction == "down"){
                        swipe_v = "berita";
                        $("#hands").attr("src","img/atasbawah.png");
                        speak("Submenu : Informasi berita terbaru. Ketuk 2 kali untuk memulai.");
                        $("#dynmenu").html("<h3>Menu : Portal Informasi</h3><h4>Submenu: Informasi berita terbaru. </h4><span>Ketuk 2 kali untuk memulai</span>");
                    }
                    return false;
               }
             }
         });
     }
     
     registerNav();
}