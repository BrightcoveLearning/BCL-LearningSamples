videojs.registerPlugin('noFullscreen', function() {
  var myPlayer = this;
  myPlayer.tech_.off(‘dblclick’);
});
