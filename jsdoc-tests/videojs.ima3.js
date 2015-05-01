/**
 * Support for Google's IMA 3 SDK in Video.js
 *
 * If you're looking for information on how IMA 3 works, this is your ticket:
 *  - https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/ads
 */
(function(window, document, vjs, undefined) {
var

  /**
   * IMA3 Plugin base object.
   */
  plugin = vjs.ima3 = {},

  /**
   * Default values for optional plugin config options.
   */
  defaults = plugin.defaults = {

    // The URL of the IMA3 SDK
    sdkurl: (/^(file|data):/.test(location.protocol) ? 'http:' : '') + '//s0.2mdn.net/instream/html5/ima3.js',

    // the ad technology preference order
    adTechOrder: ['flash', 'html5'],

    // The URL of the ad server to make requests to during playback
    serverUrl: (location.protocol === 'file:' ? 'http:' : '') + '//pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=%2F6062%2Fiab_vast_samples&ciu_szs=300x250%2C728x90&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]&cust_params=iab_vast_samples%3Dlinear',

    // the location of the IMA3 ad display SWF
    adSwf: (location.protocol === 'file:' ? 'http:' : '') + '//players.brightcove.net/videojs-ima3/videojs.ima3.swf',

    // determines if there's a loading spinner animation while ad is loading
    loadingSpinner: false,

    // The options to use when initializing the ad control bar. The ad control
    // bar is displayed when a separate display element is used for ad playback.
    // Currently, this is only true for the Flash ad tech.
    // adControlBar: inherited at runtime from the content control bar

    // @see the `timeout` option from videojs-contrib-ads
    timeout: 5000,
    // @see the `prerollTimeout` option from videojs-contrib-ads
    prerollTimeout: 1000
  },

  /**
   * Initialize the plugin based on specified options.
   *
   * @param {object} options Options hash for specifying plugin behavior.
   * May contain the following options:
   * - sdkurl: location of the ima3.js file (optional)
   */
  ima3 = function(options) {
    var

      settings = extend({}, defaults, options || {}),

      player = this,

      // grab the tech element (HTML5 video element or Flash object)
      tech = player.el().querySelector('.vjs-tech'),

      // handy alias for the adTechOrder
      adTechOrder = settings.adTechOrder,

      // whether an appropriate ad tech can be determined
      adTechInitialized = false,

      index,
      adTech;

    // if no overrides were specified, use the regular control bar options
    if (!('adControlBar' in settings)) {
      settings.adControlBar = extend(player.options().children.controlBar, {
        name: 'adControlBar'
      });
    }

    // initialize the ad framework
    player.ads(settings);

    player.on('ima3-ready', function() {
      var i;
      player.ima3.isReady_ = true;

      for (i = 0; i < player.ima3.readyQueue_.length; i++) {
        player.ima3.readyQueue_[i].call(this);
      }
      // Reset Ready Queue
      player.ima3.readyQueue_ = [];
    });

    // replace the ima3 initializer with the namespace
    player.ima3 = {
      readyQueue_: [],
      isReady_: false,
      player: player,
      tech: tech,
      settings: settings,
      ready: function(fn) {
        if (fn) {
          if (player.ima3.isReady_) {
            fn.call(this);
          } else {
            if (player.ima3.readyQueue_ === undefined) {
              player.ima3.readyQueue_ = [];
            }
            player.ima3.readyQueue_.push(fn);
          }
        }
        return player.ima3;
      },
      adrequest: function(adTagUrl) {
        if (!adTagUrl) {
          vjs.log('On demand adRequest attempted without an adTagUrl!');
          return;
        }
        vjs.log('Clearing any previous VAST ad data and triggering ondemand adrequest.');
        vjs.ima3[adTech].adrequest(adTagUrl);
      },
      version: '{{ VERSION }}'
    };

    // If the tech is not being re-used for ad playback, prevent the
    // content video from playing. Autoplay, for instance, can trigger
    // asynchronous play attempts that lead the content video to play
    // during linear ad mode.
    // see https://github.com/videojs/video.js/issues/1413
    player.on('adplay', function() {
      if (player.currentSrc() === player.ads.snapshot.src) {
        // calling pause() in a play event handler sends iOS 6 into a
        // play/pause loop so cancel the play asynchronously
        setTimeout(function() {
          player.pause();
        }, 0);
      }
    });

    // initialize the appropriate ad tech
    for (index in adTechOrder) {
      adTech = adTechOrder[index].charAt(0).toUpperCase() +
        adTechOrder[index].substring(1).toLowerCase();

      if (vjs[adTech].isSupported()) {
        // invoke the ad tech initializer
        vjs.ima3[adTech].call(player, settings);
        player.addClass('vjs-ima3-' + adTech.toLowerCase());

        // add loading spinner class
        if (settings.loadingSpinner) {
          player.addClass('ima3-loading-spinner');
        }
        adTechInitialized = true;
        break;
      }
    }

    // report an error if no ad tech could be loaded
    if (!adTechInitialized) {
      vjs.log('No supported ad tech available. If you have removed one of the ' +
              'default ad techs, you may want to consider adding it back in.');
      return;
    }
  },

  /**
   * Copies properties from one or more objects onto an original.
   */
  extend = vjs.ima3.extend = function(obj /*, arg1, arg2, ... */) {
    var arg, i, k;
    for (i=1; i<arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  };

/**
 * A minimalist player to wrap interactions with the ad player managed by IMA3.
 * This player is then specialized by the particular IMA3 integration in use to
 * provide ad controls and proxy information between the ad and content players.
 */
vjs.ima3.AdPlayer = videojs.Component.extend({
  buffered: function() {
    return [];
  },
  init: function(elem, options, ready) {
    // run the prototype initializers
    vjs.Component.call(this, this, options, ready);
  },
  language: function() {},
  languages: function() {},

  // FIXME: languages is being mangled by Closure Compiler in video.js
  // 4.7.2 Remove this stub as soon as
  // https://github.com/videojs/video.js/issues/1420 is fixed
  Va: function() {},

  localize: function() {},
  muted: function(value) {
    if (value !== undefined) {
      return this.volume(value ? 0 : 1) === 0;
    }
    return this.volume() === 0;
  },
  remainingTime: function() {
    return this.duration() - this.currentTime();
  },
  exitFullscreen: function() {
    return this.options().contentPlayer.exitFullscreen();
  },
  reportUserActivity: function() {},
  requestFullscreen: function() {
    return this.options().contentPlayer.requestFullscreen();
  },
  textTracks: function() {},
  remoteTextTracks: function() {},
  addTextTrack: function() {},
  addRemoteTextTrack: function() {},
  removeRemoteTextTrack: function() {}
});

// register plugin
vjs.plugin('ima3', ima3);

})(window, document, videojs);
