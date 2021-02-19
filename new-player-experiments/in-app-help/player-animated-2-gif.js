videojs.registerPlugin('forAnimatedGif', function () {
  var videoLoopNum = 0, maxPlays = 3;
  myPlayer = this;
  myPlayer.controlBar.hide();
  myPlayer.muted(true);
  myPlayer.autoplay(true);

  myPlayer.on("ended", function() {
      if (videoLoopNum < maxPlays - 1) { // Start video playback
          myPlayer.play(); // Increment number of times video played 
          videoLoopNum++;
      }
      if (videoLoopNum == maxPlays - 1) {
          myPlayer.controlBar.show();
      }
  });
});
