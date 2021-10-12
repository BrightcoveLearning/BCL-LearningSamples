var seekBarClickedTime;

// +++ Define the middleware function+++
var getSeekedTime = function(player) {
  return {
  // +++ Set seek time in setCurrentTime method +++
    setCurrentTime: function setCurrentTime(ct) {
      seekBarClickedTime = ct;
      return ct;
    }
  }
};

// Register the middleware with the player
videojs.use('*', getSeekedTime);

// Initialize mouseup event on seekbar
videojs.getPlayer('myPlayerID').ready(function() {
  var myPlayer = this;
  myPlayer.controlBar.progressControl.seekBar.on('mouseup', function(event) {
    displayTimesHere.innerHTML += seekBarClickedTime + '<br>';
  });
});
