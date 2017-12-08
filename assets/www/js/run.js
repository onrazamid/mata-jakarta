$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var retries = 0;
var wait = 0;
var intervalId = null;
var varCounter = 0;
var readResultTF = "x";
var token = "";
var langcode = "";

function clearCache() {
    navigator.camera.cleanup();
}

function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;
        //alert('Done!');
        //alert(JSON.stringify(r));
        speak('Memulai proses');
        console.log("X Resp : " + r.response);
        var resp = JSON.parse(r.response);
        token = resp.token;
        varCounter = 0;
        var varName = function(){
             if (varCounter <= 5) {
                  varCounter++;
                  console.log("Wait : " + varCounter);
                  readResult(token);
                  console.log("TF : " + readResultTF);
                  if (readResultTF == "completed") {
                    clearInterval(intervalId);
                    varCounter = 6; //exit
                  }
             } else {
                  console.log("no data");
                  speak('Mohon coba lagi, mungkin gambar kurang jelas');
                  clearInterval(intervalId);
             }
        };

        intervalId = setInterval(varName, 5000);
    }

    var fail = function (error) {
        if (retries == 0) {
            retries ++;
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {'locale':'id_ID','language':'id_ID'};

    var headers={'authorization':'CloudSight Y-uKKCFjM9ODX-oyC-JJfg','cache-control':'no-cache' };
    options.headers = headers;

    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("https://api.cloudsight.ai/v1/images"), win, fail, options, false);

    speak("Mengunggah gambar");
}

function capturePhoto() {
    var options = {
        name: "Image", //image suffix
        dirName: "CameraPictureBackground", //foldername
        orientation: "portrait", //or landscape
        type: "back" //or front
    };

    window.plugins.CameraPictureBackground.takePicture(onCapturePhoto, onFail, options);
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function CaptureBCK() {
    var options = {
    name: "Image", //image suffix
    dirName: "CameraPictureBackground", //foldername
    orientation: "portrait", //or landscape
    type: "back" //or front
    };

    window.plugins.CameraPictureBackground.takePicture(success, onFail, options);
}

function readResult(xtoken){
    console.log("readResult : " + xtoken);
    $.ajax({
      url: 'https://api.cloudsight.ai/v1/images/'+xtoken,
      dataType:'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("authorization", "CloudSight Y-uKKCFjM9ODX-oyC-JJfg");
      },
      success: function(data) {
        console.log("AJAX Status : " + data.name);
        if(data.status=='completed'){
            speak("Ini adalah "+data.name);
            $("#hasilfoto").text("Hasil foto : "+data.name);
            readResultTF = data.status;
        } else {
            speak("Mohon tunggu sebentar");
            readResultTF = data.status;
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
        //alert(reason);
    });
}

function onDeviceReady() {
    speak("Menu: Identifikasi barang, ketuk 2 kali untuk mulai memfoto, ketuk 1 kali untuk mengulang hasil baca foto. Geser ke kanan atau kiri untuk ke menu lainnya.");
    navigator.globalization.getPreferredLanguage(
        function (language) {
            langcode = language.value;
            $("#langcode").text('language: ' + language.value + '\n');
        },
        function () {
            langcode = "en-US";
            alert('Error getting language\n');
        }
    );

    $('#test-click').on("click",function(){
        navigator.vibrate(100);
    });

    $('#res_btn').on("click",function(){
        readResult(token);
    });

    $('#tts_btn').on("click",function(){
        navigator.vibrate(100);
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        capturePhoto();
    });

    $(document).swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if (direction=="right"){
            window.location = "bantuan.html";
          } else {
            //window.location = "maps.html";
            window.location = "rumahsakit.html";
          }
        }
    });

    $(document).on("dblclick",function(){
        navigator.vibrate(100);
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        capturePhoto();
    });

    $(document).on("click",function(){
        //navigator.vibrate(100);
        readResult(token);
    });
}
