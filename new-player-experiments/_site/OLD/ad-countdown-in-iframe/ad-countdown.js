videojs.registerPlugin('adCountdown', function () {
  // +++ Helpful method to convert seconds +++
    /**
     * Utility to extract h/m/s from seconds
     * @param {number} secs - seconds to convert to hh:mm:ss
     */
    function secondsToTime(secs) {
      var hours = Math.floor(secs / (60 * 60));
      if (hours < 10) {
        hours = "0" + hours.toString();
      } else {
        hours = hours.toString();
      };
      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
      minutes = minutes.toString();
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);
      if (seconds < 10) {
        seconds = "0" + seconds.toString();
      } else {
        seconds = seconds.toString();
      };
      var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
      };
      return obj;
    }
      var myPlayer = this;
      // Initially  hide the overlay
      myPlayer.addClass("hide-overlay");
      // +++ Set up listening for ad events +++
      myPlayer.on('loadedmetadata', function() {
        var theInterval,
          timeLeftInAd;
        // Function to be called every second during ad playback
        // Calculates time remaining and injects into overlay
        function everySecond() {
          var timeObject = secondsToTime(Math.floor(myPlayer.ima3.adPlayer.duration() - myPlayer.ima3.adPlayer.currentTime()));
          document.getElementById('timeTarget').innerHTML = timeObject.m + ':' + timeObject.s;
        }
        // +++ On start of ad +++
        myPlayer.on('ima3-started', function() {
          // Remove the hide class so overlay displays
          myPlayer.removeClass("hide-overlay");
          // Start the counter that calls function every second
          theInterval = setInterval(everySecond, 1000);
        });
        // +++ On end of ad +++
        myPlayer.on('ima3-complete', function() {
          // Stop the counter
          clearInterval(theInterval);
          // Hide the overlay
          myPlayer.addClass("hide-overlay");
          // Clear any numbers so on display of overlay no small numbers left
          document.getElementById('timeTarget').innerHTML = '';
        });
      });
    });
