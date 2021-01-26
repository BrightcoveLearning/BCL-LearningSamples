videojs.registerPlugin('forAnimatedGif', function() {
  var myPlayer = this;
  myPlayer.controlBar.hide();
  myPlayer.muted(true);
  myPlayer.autoplay(true);
  myPlayer.loop(true);
});
