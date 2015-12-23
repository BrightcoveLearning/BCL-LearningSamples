/**
 * Support for Google's IMA 3 SDK in Video.js
 *
 * If you're looking for information on how IMA 3 works, this is your ticket:
 *  - https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/ads
 */
(function(window, document, videojs, undefined) {
var

  /**
   * IMA3 Plugin base object.
   */
  plugin = videojs.ima3 = {},

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
    prerollTimeout: 1000,
    // when to request ads: during player load ('onload'), during playback ('onplay'), ondemand ('ondemand'), cuechange ('oncue')
    requestMode: 'onload'
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
      i,
      adTech,
      onCueChangeHandler,
      previousCueTime;

    // if no overrides were specified, use the regular control bar options
    if (!('adControlBar' in settings)) {
      settings.adControlBar = extend({}, player.options_.children.controlBar, {
        name: 'adControlBar'
      });
    }
    //Adding the Brightcove Universal Events here
    settings.eventMap = {
      'ima3-click': 'ads-click',
      'ima3-started': 'ads-ad-started',
      'ima3-complete': 'ads-ad-ended',
      'ima3-first-quartile': 'ads-first-quartile',
      'ima3-midpoint': 'ads-midpoint',
      'ima3-third-quartile': 'ads-third-quartile',
      'ima3-volume-changed': 'ads-volumechange',
      'ima3-paused': 'ads-pause',
      'ima3-resumed': 'ads-play',
      'ima3-all-ads-completed': 'ads-allpods-completed',
      'ads-request': 'ads-request',
      'ads-pod-ended': 'ads-pod-ended',
      'ads-pod-started' : 'ads-pod-started',
      'ads-load' : 'ads-load'
    };
    // Use the option below to get the debugging results, leaving the line below as a comment. Uncomment for usage.
    //settings.debug=true;
    
    // initialize the ad framework
    player.ads(settings);
    
    //Setting up the adinfo object here
    player.ads.ad = {};
    
    //setting up the adpodinfo object here
    player.ads.pod = {
      'id': undefined,
      'size' : undefined 
    };
    onCueChangeHandler = function (player) {
      return function onCueChange () {
        var
          track = this,
          cue = track.activeCues[track.activeCues.length - 1],
          cueData,
          adServerUrl,
          adRequest = function (cue) {
            if (track.activeCues.length) {
              if (cue.value && cue.value.key === 'TXXX') {
                // parse the cue to get the duration of ad requested
                // and/or serverUrl. Make ondemand adrequest with the new server url.
                try {
                  cueData = JSON.parse(cue.value.data);
                  if (cueData.name === 'adCue') {
                    adServerUrl = player.ima3.adMacroReplacement(cueData.parameters.serverUrl || player.ima3.settings.serverUrl);
                    videojs.log('ondemand ad request at ', Math.floor(cue.startTime));
                    player.ima3.adrequest(adServerUrl + '&' + 'breaklength=' + cueData.parameters.duration);
                  }
                } catch(e) {
                  // log out invalid JSON
                  videojs.log('ERROR: Parsing JSON. Please confirm that JSON is valid.');
                }
              }
            }
          };

        // on iPad/iPhone, we see multiple cuechange events firing for startTime like
        // 120.203, 120.210 even though the cue startTime is 120. We floor these numbers
        // and if the difference between them is 0, we then don't invoke adRequest.
        if (cue && (Math.floor(cue.startTime) - previousCueTime) === 0) {
          videojs.log('do not request ondemand ad for the same cuechange event');
        } else {
          adRequest(cue);
        }

        if (cue) {
          previousCueTime = Math.floor(cue.startTime);
        }
      };
    };

    // if cuechange option is set to true, handle the cuechange events.
    if (settings.requestMode === 'oncue') {
      player.on('loadstart', function() {
        var
          tracks = player.textTracks(),
          track,
          i;

        // check the player for text tracks when its video data has loaded
        if (tracks.length > 0) {
          // if textTracks are found
          for (i = 0; i < tracks.length; i++) {
            track = tracks[i];
            if (track.kind === 'metadata') {
                track.mode = 'hidden';
                track.addEventListener('cuechange', onCueChangeHandler(player));
            }
          }
        } else {
          // if no text tracks are found, check when they are added
          tracks.addEventListener('addtrack', function(event) {
            track = event.track;
            if (track.kind === 'metadata') {
              track.mode = 'hidden';
              track.addEventListener('cuechange', onCueChangeHandler(player));
            }
          });
        }
      });
    }
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
      makeAdRequestFunction: function (techAdRequestFn) {
        return function (adTagUrl) {
          var serverUrl = adTagUrl || this.settings.serverUrl;
          if (!serverUrl) {
            videojs.log('On demand adRequest attempted without an adTagUrl!');
            return;
          }
          videojs.log('Clearing any previous VAST ad data and triggering ondemand adrequest.');
          techAdRequestFn.call(player, serverUrl);
        };
      },
      adMacroReplacement: function(url) {
        var parameters = {
          "{player.id}": player.id(),
          "{mediainfo.id}": '',
          "{mediainfo.name}": '',
          "{mediainfo.description}": '',
          "{mediainfo.tags}": '',
          "{mediainfo.reference_id}": '',
          "{mediainfo.duration}": '',
          "{player.duration}": player.duration(),
          "{timestamp}": new Date().getTime(),
          "{document.referrer}": document.referrer,
          "{window.location.href}": window.location.href,
          "{random}": Math.floor(Math.random() * 1000000000000)
        };

        if (player.mediainfo) {
          parameters["{mediainfo.id}"] = player.mediainfo.id;
          parameters["{mediainfo.name}"] = player.mediainfo.name;
          parameters["{mediainfo.description}"] = player.mediainfo.description;
          parameters["{mediainfo.tags}"] = player.mediainfo.tags;
          parameters["{mediainfo.reference_id}"] = player.mediainfo.reference_id;
          parameters["{mediainfo.duration}"] = player.mediainfo.duration;
        }

        if (player.bcAnalytics) {
          parameters["{player.url}"] = window.location.protocol + "//" + player.bcAnalytics.settings.player;
        }

        // go through all the replacement parameters and apply them to the serverUrl
        // this will replace all occurrences of the replacement parameters - a global search and replace
        for (var i in parameters) {
          url = url.split(i).join(encodeURIComponent(parameters[i]));
        }
        return url;
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
    for (i = 0; i < adTechOrder.length; i++) {
      adTech = adTechOrder[i].charAt(0).toUpperCase() +
        adTechOrder[i].substring(1).toLowerCase();

      if (videojs.getComponent(adTech).isSupported()) {
        // invoke the ad tech initializer
        videojs.ima3[adTech].call(player, settings);
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
      videojs.log('No supported ad tech available. If you have removed one of the ' +
              'default ad techs, you may want to consider adding it back in.');
      return;
    }
  },

  /**
   * Copies properties from one or more objects onto an original.
   */
  extend = videojs.ima3.extend = function(obj /*, arg1, arg2, ... */) {
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
videojs.ima3.AdPlayer = videojs.extend(videojs.getComponent('Component'), {
  constructor: function() {

    // Pass `this` as the first argument to the Component constructor because
    // we want this object to be treated as a player.
    var args = [this].concat(Array.prototype.slice.call(arguments));
    videojs.getComponent('Component').apply(this, args);
  },
  buffered: function() {
    return [];
  },
  language: function() {},
  languages: function() {},
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
    return this.options_.contentPlayer.exitFullscreen();
  },
  reportUserActivity: function() {},
  requestFullscreen: function() {
    return this.options_.contentPlayer.requestFullscreen();
  },
  textTracks: function() {},
  remoteTextTracks: function() {},
  addTextTrack: function() {},
  addRemoteTextTrack: function() {},
  removeRemoteTextTrack: function() {},
  scrubbing: function() {}
});

// register plugin
videojs.plugin('ima3', ima3);

})(window, document, videojs);
