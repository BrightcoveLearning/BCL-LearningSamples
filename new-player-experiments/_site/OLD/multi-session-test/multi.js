videojs.registerPlugin('multipleSession', function() {
    // Function to read the browser cookie
    var read_cookie = function (key) {
        var result;
        return (result = new RegExp('(^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? result[2] : null;
    }

    // Initialize variables and read the browser cookie associated with the Brightcove video position
    var myPlayer = this,
        videoStart = 0,
        currentPosition,
        cookie = read_cookie("BC_position");

    // If the cookie exists, then set the video start position to this value. Otherwise, start from the beginning of the video.
    if(cookie != null){
        videoStart = cookie;
      } else {
        videoStart = 0;
      }

      // Wait for when the player is ready.
      myPlayer.on("loadedmetadata", function () {
        // If video position is greater than zero, than start playback at that point.
        if (cookie > 0) {
          myPlayer.currentTime(parseInt(cookie));
          myPlayer.play();
        }
      })
      // Display the video start position
      document.getElementById("cookieDisplay1").innerHTML = videoStart;

      // Listen for when the current playback position has changed. This should be every 15-250 milliseconds.
      myPlayer.on("timeupdate", function() {
        currentPosition = myPlayer.currentTime();
        // When the integer value changes, then update the cookie
        if (Math.round(currentPosition) != videoStart) {
            videoStart = Math.round(currentPosition);
            document.cookie="BC_position=" + escape(videoStart) + ";";
            // Display the current video position
            document.getElementById("cookieDisplay2").innerHTML = read_cookie("BC_position");
          }
      });

      // When video playback reaches the end, then reset the cookie value to zero
      myPlayer.on("ended", function () {
        videoStart = 0;
        document.cookie="BC_position=;expires=0;";
      })

});
