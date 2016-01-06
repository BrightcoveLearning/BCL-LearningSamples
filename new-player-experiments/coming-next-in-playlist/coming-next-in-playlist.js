videojs.plugin('comingNextInPlaylist', function () {
  var myPlayer = this,
    intervalID,
    playlistInfo,
    timeToDisplayOverlay = 5,
    lengthOfPlaylist = 0;

  // Add Overlay to player, which is hidden immediately
  myPlayer.overlay({
    overlays: [{
      content: '<h3>this is the overlay</h3>',
      start: 'play'
    }]
  });

  // Wait for loadedmetatdata to get playlist info
  // Code in this block only performed once, hence one() method for the event listener
  myPlayer.one('loadedmetadata', function () {
    myPlayer = this;
    playlistInfo = myPlayer.playlist();
    lengthOfPlaylist = playlistInfo.length;
    // Set interval to call function every one second
    intervalID = window.setInterval(checkTime, 1000);
    // Listen for every loadedmetatdata, which means a new video has been loaded in the player
    myPlayer.on('loadedmetadata', videoChanged);
    // Hide overlay on initial load of player
    myPlayer.addClass("hide-overlay");
    myPlayer.play();
  });

  // Function called every one second
  function checkTime() {
    if (!myPlayer.paused()) {
      // Calculate time remaining in video
      var currentVideoIndex = myPlayer.playlist.currentItem(),
        nextVideoIndex = currentVideoIndex + 1,
        currentVideoDuration = playlistInfo[currentVideoIndex].duration,
        timeRemaining = currentVideoDuration - myPlayer.currentTime();
      // Assign name of next video, or assign end of playlist note
      if (nextVideoIndex < lengthOfPlaylist) {
        nextVideoName = playlistInfo[nextVideoIndex].name
      } else {
        nextVideoName = 'Last video in playlist'
      };
      // Display overlay with name or note if near end of video
      // Default time to display note is 5 seconds to end
      if (timeRemaining <= timeToDisplayOverlay) {
        var theDiv = document.getElementsByClassName("div.vjs-overlay");
        document.getElementsByClassName("vjs-overlay")[0].innerHTML = nextVideoName;
        myPlayer.removeClass("hide-overlay");
        if (nextVideoIndex >= lengthOfPlaylist) {
          window.clearInterval(intervalID);
        };
      };
    } else {
      console.log('video paused');
    }
  }

  // If video changed, hide overlay
  function videoChanged() {
    myPlayer.addClass("hide-overlay");
  }
});