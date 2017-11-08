videojs.registerPlugin('stillWatching', function() {
  // +++ Initialize variables +++
  var myPlayer = this,
    msgShown = false,
    options = {
      // elapsed time for checking if viewer is still there (in seconds)
      timeCheckPoint: 5,
      // time to allow before stopping video (in seconds)
      timeOut: 5
    },
    // reference in overlay message
    eTimerSpan,
    // references to option elements (for sample only - developers would set these in the options object above)
    eTimeCheckOption = document.getElementById("timeCheckOption"),
    eTimeOutOption = document.getElementById("timeOutOption"),
    eTimeSinceLastCheck = document.getElementById("timeSinceLastCheck"),
    eCurrentPosition = document.getElementById("currentPosition"),
    // counters for time and videos elapsed (short-form) and time checks (long-form)
    totalElapsedTime = 0,
    timeSinceLastCheck = 0,
    timeToNextPoint = options.timeCheckPoint,
    intervalID,
    lastCheckTime = 0;

  // +++ Configure the overlay +++
  myPlayer.overlay({
    "name": "overlay",
    "content": '<strong>Default overlay content</strong>',
    "overlays": [{
      "content": "<div id='overlayButton'>Just checking...are you still there? Click this message to continue watching, or the video will stop in <span id='timerSpan'></span> seconds</div>",
      "start": "loadedmetadata",
      "align": "bottom-left"
    }]
  });

  // +++ Initially hide the overlay message +++
  myPlayer.addClass("hide-overlay");

  // +++ Display overlay message and start countdown to pause +++
  var showMessage = function() {
    console.log('in function: showMessage');
    var seconds_left = options.timeOut;
    eTimerSpan.innerHTML = seconds_left;
    // show the overlay message
    myPlayer.removeClass("hide-overlay");
    // start the countdown
    intervalID = setInterval(function() {
      seconds_left -= 1;
      eTimerSpan.innerHTML = seconds_left;
      console.log('seconds left: ', seconds_left);
      if (seconds_left <= 0) {
        // reset the counters
        resetCounters();
        // stop the video
        myPlayer.pause();
        // hide the overlay message
        hideMessage();
        lastCheckTime = Math.floor(myPlayer.currentTime());
      }
    }, 1000);
  };

  // +++ Hide the overlay +++
  var hideMessage = function() {
    console.log('in function hideMessage');
    myPlayer.addClass("hide-overlay");
  };

  // +++ Reset counters after click or pause +++
  var resetCounters = function() {
    console.log('in function resetCounters');
    clearInterval(intervalID);
    totalElapsedTime = 0;
    timeSinceLastCheck = Math.floor(myPlayer.currentTime()) - lastCheckTime;
    timeToNextPoint = myPlayer.currentTime() + options.timeCheckPoint;
    msgShown = false;
  }

  // +++ When the player is loaded, add a click event listener to the overlay +++
  myPlayer.one("loadedmetadata", function(evt) {
    eTimerSpan = document.getElementById("timerSpan");
    overlayButton.addEventListener("click", function() {
      lastCheckTime = Math.floor(myPlayer.currentTime());
      resetCounters();
      hideMessage();
    });
  });

  // +++ When playback position changes, show the overlay msg if greater than time check point +++
  myPlayer.on("timeupdate", function(evt) {
    console.log('myPlayer.currentTime()', myPlayer.currentTime());
    timeSinceLastCheck = Math.floor(myPlayer.currentTime()) - lastCheckTime;
    console.log('timeSinceLastCheck', timeSinceLastCheck);
    if (myPlayer.currentTime() + totalElapsedTime > timeToNextPoint) {
      if (!msgShown) {
        console.log("startTime ", myPlayer.currentTime());
        showMessage();
        msgShown = true;
      }
    }

    // Sample only: show time elapsed and position
    eTimeSinceLastCheck.innerHTML = timeSinceLastCheck;
    eCurrentPosition.innerHTML = Math.round(myPlayer.currentTime());
  });

  // Sample only -- update options - developer would just do this in the code
  updateOptions = function() {
    options.timeCheckPoint = parseInt(eTimeCheckOption.value);
    options.timeOut = parseInt(eTimeOutOption.value);
  }

  // Sample only: add event listeners for options changes
  eTimeCheckOption.addEventListener("change", updateOptions);
  eTimeOutOption.addEventListener("change", updateOptions);

});
