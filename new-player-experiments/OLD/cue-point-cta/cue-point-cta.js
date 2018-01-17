videojs.plugin('cuePointCTA', function() {

  var myPlayer,
    timeoutID,
    removeCTATime,
    cuePointAra = [],
    allCuePointData;
  myPlayer = this;
  myPlayer.overlay({
    overlays: [{
      content: '<h3>this is the overlay</h3>',
      align: 'top',
      start: 'play'
    }]
  });
  myPlayer.addClass("hide-overlay");
  myPlayer.on('loadstart', function (evt) {
    cuePointAra = myPlayer.mediainfo.cue_points;
    var tt = myPlayer.textTracks()[0];
    tt.oncuechange = function () {
      if (tt.activeCues[0] !== undefined) {
        allCuePointData = getSubArray(cuePointAra, 'time', tt.activeCues[0].startTime);
        displayCTA(allCuePointData[0]);
      }
    }
    myPlayer.play();
    myPlayer.muted(true);
  });

  function displayCTA(cpData) {
    var dataAra = cpData.metadata.split(';'),
      durationCTA = dataAra[0],
      textCTA = dataAra[1],
      urlCTA = dataAra[2],
      hrefCTA = '<a href="' + urlCTA + '"><span style="background-color: #999999">' + textCTA + '</span></a>',
      timeoutValue;
    timeoutValue = Number(durationCTA) * 1000;
    timeoutID = window.setTimeout(checkTime, timeoutValue);
    document.getElementsByClassName("vjs-overlay")[0].innerHTML = hrefCTA;
    myPlayer.removeClass("hide-overlay");
  }

  function checkTime() {
    window.clearTimeout(timeoutID);
    myPlayer.addClass("hide-overlay");
  }

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
