videojs.registerPlugin('videoAfterPlaylist', function() {
    var myPlayer = this,
    // Assign video to be played at end of playlist
    afterPlaylistVideo = 4607357817001,
    // Create variable for use in check if playlist over
    currentVideoInPlaylist;

  myPlayer.one('loadedmetadata', function(){
    // Get length of playlist for check if playlist over
    var lengthOfPlaylist = myPlayer.playlist().length;
    // Start playing first video in playlist
    myPlayer.play();

    // +++ Define on event handler +++
    // On end of every video check to see if playlist over
    myPlayer.on('ended',function(){
      // Get current video in playlist, add 1 since array 0 indexed
      currentVideoInPlaylist = myPlayer.playlist.currentItem() +1;
      // Check if playlist is over by comparing length to index of last video played
      if( lengthOfPlaylist === currentVideoInPlaylist ){
        // Use Video Cloud catalog to get video object
        myPlayer.catalog.getVideo(afterPlaylistVideo, function(error, video){
          // Load the video object into the player
          myPlayer.catalog.load(video);
          // Play the video
          myPlayer.play();
          // Remove event listener or will be in infinite loop playing last video
          myPlayer.off('ended');
        })
      }
    });
  });
});
