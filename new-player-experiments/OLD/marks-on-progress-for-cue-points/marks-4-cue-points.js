videojs.plugin('marks4CuePoints', function () {
  var myPlayer = this,
    startTimesAra = [];
  myPlayer.on('loadstart', function () {
    var cuePointsAra = [],
      adCuePointsAra = [],
      videoDuration;

    // Extract cue points array from mediainfo
    cuePointsAra = myPlayer.mediainfo.cuePoints;
    console.log('cuePointsAra', cuePointsAra);

    // Extract ad cue points from all cue points
    adCuePointsAra = cuePointsAra.filter(isAdCuePoint);
    console.log('adCuePointsAra', adCuePointsAra);

    // Extract start times from ad cue points
    startTimesAra = adCuePointsAra.map(function (a) {
      return a.startTime;
    });
    console.log('startTimesAra', startTimesAra);

    // get the video duration
    videoDuration = myPlayer.mediainfo.duration;

    // add cuePoint markers for ad cue points
    addAdMarkers(adCuePointsAra, videoDuration);
  });

  // Function used with array filter
  function isAdCuePoint(cuePoint) {
    return cuePoint.type == 'AD';
  }

  // function to add AD cue point markers
  function addAdMarkers(adCuePointsAra, videoDuration) {
    var iMax = adCuePointsAra.length,
      i,
      playheadWell = document.getElementsByClassName('vjs-progress-control vjs-control')[0];
    for (i = 0; i < iMax; i++) {
      var elem = document.createElement('div');
      elem.className = 'vjs-marker';
      elem.id = 'ad' + i;
      elem.style.left = (adCuePointsAra[i].time / videoDuration) * 100 + '%';
      playheadWell.appendChild(elem);
    }
  }
});
