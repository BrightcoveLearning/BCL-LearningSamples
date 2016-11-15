videojs.plugin('listenForButtons', function() {
  var player = this,
  actOnVideo = function(evt){
      if(evt.data === "playVideo"){
        player.play();
      } else if (evt.data === "pauseVideo") {
        player.pause();
      } else if (evt.data === "muteVideo") {
        player.muted(true)
      } else if (evt.data === "currentTimeVideo") {
        player.currentTime(15);
      }
  };
  window.addEventListener("message",actOnVideo);
});
