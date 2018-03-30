// +++ Define the middleware function+++
var disableForwardScrubbing = function(player) {
  return {
    // +++ Set the source to use any tech +++
    setSource: function setSource(srcObj, next) {
      next(null, srcObj);
    },
    // +++ Alter the setCurrentTime method +++
    setCurrentTime: function setCurrentTime(ct) {
      var percentAllowForward = 50,
       // Determine %tage of video played
       percentPlayed = player.currentTime() / player.duration() * 100;
       // Check if the time scrubbed to is less than the current time
       // or if passed scrub forward percentage
      if ( ct < player.currentTime() || percentPlayed > percentAllowForward ) {
        // If true, move playhead to desired time
        return ct;
      }
      // If time scrubbed to is past current time and not passed %age
      // leave playhead at current time
      return player.currentTime();
    }
  }
};
