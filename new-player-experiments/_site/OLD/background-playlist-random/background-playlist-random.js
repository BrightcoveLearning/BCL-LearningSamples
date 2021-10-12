videojs.registerPlugin('backgroundPlaylistRandom', function() {
  // Get a reference to the player
  var myPlayer = this;

  // +++ Display the title and description +++
  myPlayer.on('loadstart', function() {
    videoTitle.textContent = myPlayer.mediainfo.name;
    videoDescription.textContent = myPlayer.mediainfo.description;
  })

  // +++ Shuffle (randomize) the videos +++
  myPlayer.on('duringplaylistchange', function() {
    myPlayer.playlist.shuffle();
  });

  // +++ Set the playlist to repeat +++
  myPlayer.playlist.repeat(true);

});
