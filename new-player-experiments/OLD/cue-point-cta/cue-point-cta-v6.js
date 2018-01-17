videojs.registerPlugin('cuepointCTA', function() {
  var myPlayer = this,
    timeoutID,
    removeCTATime,
    cuePointAra = [],
    allCuePointData;
    // Hide overlay initially
    myPlayer.addClass("hide-overlay");

    // +++ Listen for cue change then pass data to be displayed +++
    myPlayer.on('loadstart', function (evt) {
      cuePointAra = myPlayer.mediainfo.cue_points;
      var tt = myPlayer.textTracks()[0];
      // When a cue point starts, extract cue data and pass data to be displayed
      tt.oncuechange = function () {
        if (tt.activeCues[0] !== undefined) {
          allCuePointData = getSubArray(cuePointAra, 'time', tt.activeCues[0].startTime);
          displayCTA(allCuePointData[0]);
        }
      }
      myPlayer.play();
    });

    // +++ Extract data pieces from cue point meta data and display overlay  +++
    function displayCTA(cpData) {
      // Split metadata into an array of three pieces based on location of semicolons
      var dataAra = cpData.metadata.split(';'),
        durationCTA = dataAra[0],
        textCTA = dataAra[1],
        urlCTA = dataAra[2],
        // Dynamically build the anchor tag
        hrefCTA = '<a href="' + urlCTA + '"><span style="background-color: black; color: red;">' + textCTA + '</span></a>',
        timeoutValue;
      // Set duration, set timeout, inject dynamic html and show overlay
      timeoutValue = Number(durationCTA) * 1000;
      timeoutID = window.setTimeout(checkTime, timeoutValue);
      document.getElementsByClassName("vjs-overlay")[0].innerHTML = hrefCTA;
      myPlayer.removeClass("hide-overlay");
    }

    // +++ Clear timeout and remove overlay +++
    // This function called when timeout is reached
    function checkTime() {
      window.clearTimeout(timeoutID);
      myPlayer.addClass("hide-overlay");
    }

    // +++ Helper function to extract cue point info +++
    function getSubArray(targetArray, objProperty, value) {
      var i, totalItems = targetArray.length,
        objFound = false,
        idxArr = [];
      for (i = 0; i < totalItems; i++) {
        if (targetArray[i][objProperty] === value) {
          objFound = true;
          idxArr.push(targetArray[i]);
        }
      }
      return idxArr;
    };
});
