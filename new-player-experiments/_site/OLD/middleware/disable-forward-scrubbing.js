// +++ Define the middleware function+++
var disableForwardScrubbing = function(player) {
  return {
    // +++ Implement setSource() +++
    setSource: function setSource(srcObj, next) {
      next(null, srcObj);
    },
    // +++ Alter the setCurrentTime method +++
    setCurrentTime: function setCurrentTime(ct) {
      var percentAllowForward = 50,
       // Determine percentage of video played
       percentPlayed = player.currentTime() / player.duration() * 100;
       // Check if the time scrubbed to is less than the current time
       // or if passed scrub forward percentage
      if ( ct < player.currentTime() || percentPlayed > percentAllowForward ) {
        // If true, move playhead to desired time
        return ct;
      }
      // If time scrubbed to is past current time and not passed percentage
      // leave playhead at current time
      return player.currentTime();
    }
  }
};

// Register the middleware function with the player
videojs.use('*', disableForwardScrubbing);
