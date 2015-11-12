videojs.plugin('adCountdown', function() {
  var myPlayer = this;

  //Load options into FreeWheel plugin
  myPlayer.FreeWheelPlugin(options);

  //Place overlay at top of video on loadedmetadata
  myPlayer.overlay({
    overlays: [{
     "content": "<p>Time remaining in ad: <span id='timeTarget'></span></p>",
     "align": "top",
     "start" : "loadedmetadata"
    }]
  });

  //Initially  hide the overlay
  myPlayer.addClass("hide-overlay");

  //Listen for ad events per best practice
  myPlayer.on('loadedmetadata',function(){
    var theInterval,
      timeLeftInAd;

    //Function to be called every second during ad playback
    //Calculates time remaining and injects into overlay
    function everySecond() {
      document.getElementById('timeTarget').innerHTML = Math.floor( myPlayer.ads.pod.duration -  myPlayer.ads.pod.currentTime());
    }

    //On start of ads in pod
    myPlayer.on('ads-pod-started',function(){
      //Remove the hide class so overlay displays
      myPlayer.removeClass("hide-overlay");
      //Start the counter that calls function every second
      theInterval = setInterval(everySecond, 1000);
    });

    //On end of ads in pod
    myPlayer.on('ads-pod-ended',function(){
      //Stop the counter
      clearInterval(theInterval);
      //Hide the overlay
      myPlayer.addClass("hide-overlay");
      //Clear any numbers so on display of overlay no small numbers left
      document.getElementById('timeTarget').innerHTML = '';
    });
  });
});