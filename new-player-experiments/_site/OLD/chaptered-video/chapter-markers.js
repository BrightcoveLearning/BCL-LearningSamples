videojs.registerPlugin('chapterMarkers', function() {
  var myPlayer = this,
    videoDuration,
    cuesAra = [],
    chapterStartTimesAra = [];
  myPlayer.on('loadedmetadata', function() {
    // +++  Use the array filter function to retrieve data structure that contains chapter cue points +++
    chapterTT = [].filter.call(videojs.players.myPlayerID.textTracks(), function(tt) {
      return tt.kind === 'chapters';
    });
    //  Retrieve actual array of chapter cue points
    cuesAra = chapterTT[0].cues;

    // +++ Loop over chapter cue points and get start time of each  +++
    for (var i = 0; i < cuesAra.length; i++) {
      chapterStartTimesAra[i] = cuesAra[i].startTime;
    }

    // +++ Call function to create marks in progress bar  +++
    // Get the video duration
    videoDuration = myPlayer.mediainfo.duration;
    // Call the function to add the marks in the progress control
    addMarkers(chapterStartTimesAra, videoDuration);
  });

  // +++ Add chapter markers +++
  function addMarkers(cuePointsAra, videoDuration) {
    var iMax = cuePointsAra.length,
      i,
      playheadWell = document.getElementsByClassName('vjs-progress-control vjs-control')[0];
    // Loop over each cue point, dynamically create a div for each
    // then place in div progress bar
    for (i = 0; i < iMax; i++) {
      var elem = document.createElement('div');
      elem.className = 'vjs-marker';
      elem.id = 'cp' + i;
      elem.style.left = (cuePointsAra[i] / videoDuration) * 100 + '%';
      console.log('elem.style.left', elem.style.left);
      playheadWell.appendChild(elem);
    }
  }
});
