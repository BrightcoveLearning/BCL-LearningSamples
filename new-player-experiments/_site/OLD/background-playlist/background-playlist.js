videojs.registerPlugin('backgroundPlaylist', function() {
  var myPlayer = this;

  // +++ Set the playlist to repeat +++
  myPlayer.playlist.repeat(true);

  // +++ Display the title and description +++
  myPlayer.on('loadstart',function(){
    videoTitle.textContent = myPlayer.mediainfo.name;
    videoDescription.textContent = myPlayer.mediainfo.description;
  })
});
