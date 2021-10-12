/**
 * Infer seek location from a URL param.
 * Follow's YouTube's `t` URL parameter behavior.
 *
 * Ex: t=16m32s means seek to 16 minutes and 32 seconds
 */
(function () {
  videojs.plugin('urlparams', function (options) {
    options = options || {};
    var
    /**
     * Given a string representation of time, calculate the number of seconds.
     * Ex: '2h16m32s' means seek to 2 hours, 16 minutes and 32 seconds
     *
     * @return {number} The time in seconds or -1 if the string does not conform
     * to the supported time format.
     */
    toSeconds = function (string) {
      var
      seconds = 0,
        m;
      string = string.replace(/^\s+|\s+$/g, '');
      if (!string || !(/^(\d+h)?(\d+m)?(\d+s)?$/).test(string)) {
        return -1;
      }
      m = string.match(/^(\d+)h/);
      if (m) {
        seconds += parseFloat(m[1]) * 3600;
        string = string.replace(/^(\d+)h/, '');
      }
      m = string.match(/^(\d+)m/);
      if (m) {
        seconds += parseFloat(m[1]) * 60;
        string = string.replace(/^(\d+)m/, '');
      }
      m = string.match(/^(\d+)s/);
      if (m) {
        seconds += parseFloat(m[1]);
      }
      return seconds;
    },
      // how close must two times be to be close enough?
      delta = 2,
      /**
       * Determines whether two times are 'close enough'.
       * Unfortunately we can't count on the reported currentTime() to exactly
       * match the one we set. The best we can do is check whether they're close.
       * Two seconds should about do it.
       */
      closeEnough = function (timeA, timeB) {
        var diff = timeA - timeB;
        if (isNaN(diff)) {
          return false;
        }
        return Math.abs(diff) < delta;
      },
      player = this,
      url = options.url || window.location.href,
      m = url.match(/[#&\?]t=((?:\d+h)?(?:\d+m)?(?:\d+s)?)/),
      seconds;
    if (m) {
      seconds = toSeconds(m[1]);
      if (seconds !== -1) {
        (function () {
          var
          // how long to wait before retries
          delay = options.delay || 250,
            // timer for the next retry
            timeout,
            // whether we've been successful in setting the currentTime
            success = false,
            // attempt to set the currentTime
            attempt = function () {
              if (success || closeEnough(player.currentTime(), seconds)) {
                success = true;
                deregister();
              }
              else {
                player.currentTime(seconds);
                timeout = setTimeout(attempt, delay);
              }
            },
            // remove the timer
            deregister = function () {
              clearTimeout(timeout);
              player.off('timeupdate', deregister);
              // one final attempt
              if (!success) {
                player.currentTime(seconds);
              }
            };
          // make the first attempt
          player.on('timeupdate', deregister);
          player.ready(attempt);
        })();
      }
    }
    // is there an autoplay param?
    if ((/[#&\?]autoplay(?:$|[#&\?=])/i).test(url)) {
      // try to auto-play
      player.ready(function () {
        player.play();
      });
    }
  });
})();