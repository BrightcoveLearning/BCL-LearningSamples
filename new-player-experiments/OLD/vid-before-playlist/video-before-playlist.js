videojs.registerPlugin('videoBeforePlaylist', function(options) {
  var myPlayer = this,
    // +++ Assign playlist and video to be played before playlist values from data passed in +++
    beforePlaylistVideo = options.beforePlaylistVideo,
    playlistID = options.playlistID;

  // +++ Retrieve playlist +++
  myPlayer.catalog.getPlaylist(playlistID, function(error, myPlaylist) {
    // deal with error
    // +++ Place playlist in player, but -1 parameter does not load playlist video in player +++
    myPlayer.playlist(myPlaylist, -1);
  });

  // +++ Retrieve video to play before playlist and load it +++
  myPlayer.catalog.getVideo(beforePlaylistVideo, function(error, video) {
    //deal with error
    myPlayer.catalog.load(video);

    // +++ Set event  handler so after first video plays playlist plays +++
    myPlayer.one('ended', function() {
      myPlayer.playlist.currentItem(0)
    });
  });
});
