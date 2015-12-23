/**
 * Composes per-module `beforeEach` and `afterEach` hooks with common/shared
 * hooks.
 *
 * @param  {Object} [hooks]
 * @param  {Function} [hooks.beforeEach]
 * @param  {Function} [hooks.afterEach]
 * @return {Object}
 */
window.sharedModuleHooks = (function(videojs){
  var Flash = videojs.getComponent('Flash');
  var Html5 = videojs.getComponent('Html5');

  var backup = {
    Flash: {
      isSupported: Flash.isSupported
    },
    Html5: {
      isSupported: Html5.isSupported
    }
  };

  var common = {

    beforeEach: function() {

      // Force HTML5/Flash support.
      Html5.isSupported = Flash.isSupported = function() {
        return true;
      };

      // Use fake timers to replace setTimeout and so forth.
      this.clock = sinon.useFakeTimers();

      // Create video element and player.
      this.video = document.createElement('video');

      // Backfill broken PhantomJS implementation(s)
      if (/phantom/i.test(window.navigator.userAgent)) {
        this.video.removeAttribute = function(attr) {
          this[attr] = '';
        };

        this.video.load = this.video.load || function(){};
        this.video.play = this.video.play || function(){};
        this.video.pause = this.video.pause || function(){};
      }

      document.getElementById('qunit-fixture').appendChild(this.video);

      this.player = videojs(this.video);

      // Mock IMA
      window.google = {
        ima: {
          AdDisplayContainer: function() {
            this.initialize = function() {};
          },
          AdsLoader: function() {
            this.requestAds = function() {};
            this.contentComplete = function() {};
            this.addEventListener = function() {};
            this.getSettings = function() {
              return {
                setPlayerVersion: function(){},
                setPlayerType: function(){}
              };
            };
          },
          AdsRequest: function() {},
          ViewMode: {
            NORMAL: 1
          }
        }
      };
    },

    afterEach: function() {

      // Remove IMA mock
      delete window.google;

      // Restore original state of the techs.
      Html5.isSupported = backup.Html5.isSupported;
      Flash.isSupported = backup.Flash.isSupported;

      // Restore setTimeout et al.
      this.clock.restore();

      // Kill the player and its element (i.e. `this.video`).
      this.player.dispose();
    }
  };

  return function(hooks) {
    hooks = hooks || {};
    return {
      beforeEach: _.flow(common.beforeEach, hooks.beforeEach || _.noop),
      afterEach: _.flow(common.afterEach, hooks.afterEach || _.noop)
    };
  };
}(window.videojs));
