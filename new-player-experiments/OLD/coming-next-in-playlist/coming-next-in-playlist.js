videojs.registerPlugin('comingNextInPlaylist', function () {
  var myPlayer,
    intervalID,
    playlistInfo,
    timeToDisplayOverlay = 5,
    lengthOfPlaylist = 0,
    lastVideo = false,
    nextVideoName,
    nextThumbnail;

  videojs('myPlayerID').ready(function() {
    var myPlayer = this;

    // +++ Configure overlay, which is hidden immediately +++
    myPlayer.overlay({
      overlays: [{
        content: '<h3>this is the overlay</h3>',
        start: 'play',
        align: 'top-right'
      }]
    });
  });


  // +++ Get playlist info, hide overly, and play video +++
  // Wait for loadedmetatdata to get playlist info
  // Code in this block only performed once, hence one() method for the event listener
  videojs('myPlayerID').one('loadedmetadata', function() {
    myPlayer = this;
    playlistInfo = myPlayer.playlist();
    lengthOfPlaylist = playlistInfo.length;

    // +++ Set interval to call function every one second +++
    intervalID = window.setInterval(checkTime, 1000);

    // +++ Listen for every loadedmetatdata, which means a new video has been loaded in the player +++
    myPlayer.on('loadedmetadata', videoChanged);
    // Hide overlay on initial load of player
    myPlayer.addClass("hide-overlay");
    myPlayer.play();
  });

  // +++ Define function called every second +++
  function checkTime() {
    if (!myPlayer.paused()) {

      // Calculate time remaining in video
      var currentVideoIndex = myPlayer.playlist.currentItem(),
        nextVideoIndex = currentVideoIndex + 1,
        currentVideoDuration = playlistInfo[currentVideoIndex].duration,
        timeRemaining = currentVideoDuration - myPlayer.currentTime();

      // Assign name and thumbnail of next video, or assign end of playlist note
      if (nextVideoIndex < lengthOfPlaylist) {
        nextVideoName = 'Next video in playlist: ' + playlistInfo[nextVideoIndex].name
        nextThumbnail = playlistInfo[nextVideoIndex].thumbnail;
      } else {
        lastVideo = true;
        nextVideoName = 'Last video in playlist'
      };

      // +++ Display overlay if less than 5 seconds left in video +++
      // Display overlay with name or note if near end of video
      // Default time to display note is 5 seconds to end
      if (timeRemaining <= timeToDisplayOverlay) {
        var theDiv = document.getElementsByClassName("vjs-overlay")[0];
        if (lastVideo) {
          theDiv.innerHTML = nextVideoName;
        } else {
          theDiv.innerHTML = nextVideoName + "</br></br><img src='" + nextThumbnail + "'>";
        }

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
