videojs.registerPlugin('adMarksOnProgress', function() {
  var myPlayer = this;

  myPlayer.on('loadstart', function() {
    var cuePointsAra = [],
      adCuePointsAra = [],
      videoDuration;

    // +++ Get ad cue points from all cue points +++
    // Extract cue points array from mediainfo
    cuePointsAra = myPlayer.mediainfo.cuePoints;

    // Extract ad cue points from all cue points
    adCuePointsAra = cuePointsAra.filter(isAdCuePoint);

    // Get the video duration
    videoDuration = myPlayer.mediainfo.duration;

    // Add cuePoint markers for ad cue points
    addAdMarkers(adCuePointsAra, videoDuration);
  })
});

// +++ Filter array on ad cue points +++
function isAdCuePoint(cuePoint) {
  return cuePoint.type == 'AD';
}

// +++ Add AD cue point markers +++
function addAdMarkers(adCuePointsAra, videoDuration) {
  var iMax = adCuePointsAra.length,
    i,
    playheadWell = document.getElementsByClassName('vjs-progress-control vjs-control')[0];
  // Loop over each cue point, dynamically create a div for each
  // then place in div progress bar
  for (i = 0; i < iMax; i++) {
    var elem = document.createElement('div');
    elem.className = 'vjs-marker';
    elem.id = 'ad' + i;
    elem.style.left = (adCuePointsAra[i].time / videoDuration) * 100 + '%';
    playheadWell.appendChild(elem);
  }
}
