videojs.registerPlugin('autoAudioTrack', function() {
  var myPlayer = this;
  myPlayer.on('loadedmetadata',function(){
    var browser_language,
      track_language,
      audioTracks;
    // +++ Get the browser language +++
    browser_language = navigator.language || navigator.userLanguage; // IE <= 10
    browser_language = browser_language.substr(0, 2);

    // +++ Get the audio tracks +++
    audioTracks = myPlayer.audioTracks();
    console.log('audioTracks',audioTracks);

    // +++ Loop through audio tracks +++
    for (var i = 0; i < (audioTracks.length); i++) {
      track_language = audioTracks[i].language.substr(0, 2);

      // +++ Set the enabled audio track language +++
      if (track_language) {
        // When the track language matches the browser language, then enable that audio track
        if (track_language === browser_language) {
          // When one audio track is enabled, others are automatically disabled
          audioTracks[i].enabled = true;
        }
      }
    }
  })
});
