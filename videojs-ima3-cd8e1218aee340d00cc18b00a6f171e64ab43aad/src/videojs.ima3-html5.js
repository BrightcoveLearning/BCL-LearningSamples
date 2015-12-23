(function(window, document, videojs, undefined) {

var

  // alias the extend function
  extend = videojs.ima3.extend,

  /**
   * Initialize the HTML-based ad integration with the specified options.
   *
   * @param {object} settings Options hash for specifying plugin behavior.
   */
  plugin = videojs.ima3.Html5 = function(settings) {
    var
      player = this,
      // grab the tech element (HTML5 video element or Flash object)
      tech = player.el().querySelector('.vjs-tech'),
      // the control bar for the ad player, when running in standard
      // playback mode
      adControlBar,
      // the ad player, when running in standard playback mode
      adPlayer,
      // create ad container overlay element and insert into player
      adContainer = document.createElement('div'),
      // perform initialization after the IMA library has finished loading
      finishInitialization,
      // creates IMA AdRequest object
      constructAdsRequest,

      // make an ad request to get a new AdManager
      loadAdsManager,

      // starts adManager
      startAdsManager,

      // destroys adManager

      destroyAdsManager,
      postrollAdtimeoutHandler = function() {
        if (player.ima3 && player.ima3.adsManager && player.ima3.adsManager.skip) {
          player.ima3.adsManager.skip();
        }
        destroyAdsManager();
      },
      ima,
      ima3Events,
      adRequest,
      // Resuable Function below to reset the ad meta data
      resetAdMetaData = function(player) {
        player.ads.ad = {};
        player.ads.pod = {};
      };

    // initialize the ad container
    adContainer.className = 'vjs-ima3-ad-container';
    tech.parentNode.insertBefore(adContainer, tech.nextSibling);

    //Handle on-demand ad requests (i.e. from id3 metadata)
    adRequest = function(adTag) {
      //Need to start linear ad mode before creating the request because
      //errors can be thrown during the request.
      player.trigger('ads-request');
      player.ads.startLinearAdMode();
      destroyAdsManager();
      loadAdsManager(settings, adTag);

      // we are waiting for an ad to load
      // display spinner animation
      player.addClass('ima3-ad-loading');
    };

    // Create deprecated vjs-global version of adrequest
    videojs.ima3.Html5.adrequest = function() {
      videojs.log.warn('videojs.ima3.Html5.adrequest is deprecated. Use player.ima3.adrequest instead.');
      return adRequest.apply(this, arguments);
    };

    // Create player-local adrequest function
    player.ima3.adrequest = player.ima3.makeAdRequestFunction(adRequest);

    // start and stop ad playback when requested
    player.on('ima3-content-pause-requested', function(event) {
      player.ads.startLinearAdMode();
      // we are waiting for an ad to load
      // display spinner animation
      player.addClass('ima3-ad-loading');
      player.trigger('ads-pod-started');
    });

    player.on('ima3-content-resume-requested', function(event) {
      player.ads.endLinearAdMode();
      player.removeClass('ima3-ad-loading');
      player.trigger('ads-pod-ended');
    });

    // inform the ads manager when the player enters or exits fullscreen
    player.on('fullscreenchange', function(event) {
      var
        className = ' ' + player.el().className + ' ',
        fullscreen = className.indexOf(' vjs-fullscreen ') > -1,
        retries = 3,
        viewMode,

        // Chrome 30 on OS X reports the old player size during the
        // fullscreenchange event when testing with JPG-based static overlays.
        // Double-check the reported size for a bit after the event to make sure
        // the browser hasn't been lying to us.
        awaitStableSize = function(oldWidth, oldHeight) {
          return function() {
            // VideoJS player dimensions reports native width/height even in
            // fullscreen mode. So we set this to the window dimensions.
            if (viewMode === ima.ViewMode.FULLSCREEN) {
              player.ima3.adsManager.resize(player.el().offsetWidth,
                  player.el().offsetHeight, viewMode);
            } else {
              player.ima3.adsManager.resize(player.width(),
                  player.height(),
                  viewMode);
            }

            if (player.width() === oldWidth && player.height() === oldHeight) {
              // the fullscreen transition is finished
              return;
            }

            // check for a stable state again in a bit
            if (retries--) {
              setTimeout(awaitStableSize(player.width(), player.height()), 1000);
            }
          };
        };

      if (!player.ima3 || !player.ima3.adsManager) {
        // IMA hasn't loaded yet, so ignore this event
        return;
      }

      viewMode = fullscreen ? ima.ViewMode.FULLSCREEN : ima.ViewMode.NORMAL;

      // VideoJS player dimensions reports native width/height even in
      // fullscreen mode. So we set this to the window dimensions.
      if (viewMode === ima.ViewMode.FULLSCREEN) {
        player.ima3.adsManager.resize(player.el().offsetWidth,
            player.el().offsetHeight, viewMode);
      } else {
        player.ima3.adsManager.resize(player.width(),
            player.height(),
            viewMode);
      }

      setTimeout(awaitStableSize(player.width(), player.height()), 1000);
    });

    // log additional IMA3 events
    player.on('ima3-started', function() {
      player.removeClass('ima3-ad-loading');
      videojs.log('ima3-started');
    });

    player.on('ima3-ad-error', function(event) {
      if (event.originalEvent) {
        videojs.log('ima3-ad-error',
                event.originalEvent.getError().toString(),
                event);
      }
      player.removeClass('ima3-ad-loading');
      player.trigger('adserror');
    });

    // overlay handling
    // this workflow assumes a single overlay is displayed at a time
    player.on('ima3-loaded', function(event) {
      var ad = event.originalEvent.getAd();

      // store the current ad so it can be referred to during playback
      player.ima3.currentAd = ad;

      // A linear ad had loaded. It's time to remove spinner animation.
      player.removeClass('ima3-ad-loading');
      if (ad &&!ad.isLinear()) {
        player.addClass('vjs-ima3-overlay');
      }
    });

    player.on('ima3-complete', function(event) {
      var ad = event.originalEvent.getAd();
      videojs.log('ima3-complete');
      // the ad has completed so remove it
      delete player.ima3.currentAd;
      if (ad) {
        if (!ad.isLinear()) {
          player.removeClass('vjs-ima3-overlay');
        } else {
          //display the loading spinner in between the ads from an adPod.
          player.addClass('ima3-ad-loading');
        }
      }
    });
    // inform the AdManager when the player resizes
    player.on('resize', function() {
      if (player.ima3.adsManager) {
        player.ima3.adsManager.resize(player.width(), player.height(), ima.ViewMode.NORMAL);
      }
    });
    // inform the AdManager when the video begins
    player.on('readyforpreroll', function() {
      startAdsManager();
    });

    player.on('adserror', function() {
      destroyAdsManager();
    });

    // initialize ads for this video when the AdsManager finishes loading
    player.on('ima3-ads-manager-loaded', function(event) {
      var adsManager, playbackComponent;

      if (player.ima3.managerCleanup) {
        destroyAdsManager();
      }

      playbackComponent = {};
      playbackComponent.currentTime = player.currentTime();
      playbackComponent.duration = player.duration();

      player.on('timeupdate', function() {
        playbackComponent.currentTime = player.currentTime();
      });

      adsManager = event.originalEvent.getAdsManager(playbackComponent);

      player.ima3.adsManager = adsManager;

      // pump all the events through the player
      player.ima3.managerCleanup = pipeEvents(adsManager, ima3Events, player);

      //Once an adManager is created you need to start it.
      if (player.ads.state === 'ad-playback') {
        //In the case of an on-demand request we do this immediately.
        startAdsManager();
      } else {
        //if this isn't an ondemand case, its the typical adrequest on startup
        //and we just trigger adsready to finish the preroll handhake with contrib-ads
        //The admanager will be started later, when it gets a readyforpreroll event.
        player.trigger('adsready');
        
      }
    });

    constructAdsRequest = function(settings, adTag) {
      player.ima3.adsRequest = extend(new ima.AdsRequest(), {
        adTagUrl: player.ima3.adMacroReplacement(adTag || player.ima3.settings.serverUrl),
        // Specify both the linear and nonlinear slot sizes.
        // This helps the SDK to select the correct creative if multiple
        // creatives are returned.
        linearAdSlotWidth: player.width(),
        linearAdSlotHeight: player.height(),
        nonLinearAdSlotWidth: player.width(),
        nonLinearAdSlotHeight: player.height()
      });

      if (!player.ima3.adsRequest.adTagUrl) {
        player.trigger('adscanceled');
        return;
      }
      player.ima3.adsLoader.requestAds(player.ima3.adsRequest);
      player.trigger('ads-request');
    };

    // load the AdsManager
    loadAdsManager = function(settings, adTag) {
      // Create a new ad request which will trigger ima3-ads-manager-loaded
      if (settings.requestMode === 'onplay') {
        player.one('play', function() {
          constructAdsRequest(settings, adTag);
        });
      } else {
        constructAdsRequest(settings, adTag);
      }
    };

    startAdsManager = function() {
      try {
        player.trigger('ads-load');
        player.ima3.adsManager.init(player.width(), player.height(), ima.ViewMode.NORMAL);         
        player.ima3.adsManager.start();
      } catch (adError) {
        player.trigger('adserror');
      }
    };

    destroyAdsManager = function() {
      if (player.ima3.adsManager) {
        player.ima3.adsManager.destroy();
        player.ima3.adsManager = null;
      }
      if (player.ima3.managerCleanup) {
        player.ima3.managerCleanup();
        player.ima3.managerCleanup = null;
      }
    };

    finishInitialization = function() {
      var
        imaSettings = settings.ima3SdkSettings,
        adsLoaderSettings,
        ControlBar = videojs.getComponent('ControlBar'),
        setting,
        setter,
        video = tech;

      ima = window.google.ima;

      ima3Events = eventTypes(ima);

      // apply any global IMA3 settings
      if (settings.ima3SdkSettings) {
        for (setting in settings.ima3SdkSettings) {
          setter = 'set' + setting.charAt(0).toUpperCase() + setting.slice(1);
          ima.ImaSdkSettings[setter](imaSettings[setting]);
        }
      }

      // create a simple player to translate calls to IMA3
      adPlayer = videojs.ima3.Html5.adPlayer(adContainer, {
        contentPlayer: player
      });
      adControlBar = new ControlBar(adPlayer, settings.adControlBar);
      adControlBar.addClass('vjs-ad-control-bar');
      player.addClass('vjs-ad-controls');
      player.addChild(adControlBar);

      // make the ad player objects accessible
      player.ima3.adControlBar = adControlBar;
      player.ima3.adPlayer = adPlayer;

      // translate events between the content player and the ad player
      player.on('adstart', function(event) {
        // pause the content player so it doesn't play in the background
        player.pause();
      });

      // set up display container
      player.ima3.adDisplayContainer =
        new ima.AdDisplayContainer(adContainer, video, settings.clickTrackingElement);

      player.one('touchstart', function() {
        player.ima3.adDisplayContainer.initialize();
      });

      // set up the ads loader
      player.ima3.adsLoader =
        new ima.AdsLoader(player.ima3.adDisplayContainer);

      //Set the playerName and playerType for Google's analytics
      adsLoaderSettings = player.ima3.adsLoader.getSettings();
      adsLoaderSettings.setPlayerVersion(player.ima3.version);
      adsLoaderSettings.setPlayerType('brightcove/player-html5');

      // pump all the events through the player
      player.ima3.loaderCleanup = pipeEvents(player.ima3.adsLoader, ima3Events, player);

      // if a video is ready, load the AdsManager if requestMode is 'onload' or 'onplay'
      if (player.currentSrc() && (settings.requestMode !== 'ondemand') && (settings.requestMode !== 'oncue')) {
        loadAdsManager(settings);
      }

      // get a new AdsManager each time the content changes
      // this is wrapped in a function so that loadAdsManager
      // is called without an args.
      player.on('contentupdate', function() {
        if ((settings.requestMode !== 'ondemand') && (settings.requestMode !== 'oncue')) {
          loadAdsManager(settings);
        }
      });

      // inform the AdsLoader when content ends to trigger postrolls
      player.on('contentended', function() {
        if (player.ads.state === 'postroll?') {
          player.one('adtimeout', postrollAdtimeoutHandler);
          player.ima3.adsLoader.contentComplete();
        }
      });

      player.on(['contentupdate', 'dispose'], function() {
        player.off('adtimeout', postrollAdtimeoutHandler);
      });
      
      //Nulling out the values for ads and pod info
      player.on(['contentupdate', 'adend', 'ima3-ready'], function () {
        resetAdMetaData(player);
      });

      // export the ad container
      player.ima3.el = adContainer;
    };

    // load ima3 sdk
    if (window.google && window.google.ima) {
      finishInitialization();
      player.trigger('ima3-ready');
    } else {
      loadScript(settings.sdkurl, function(aborted) {
        finishInitialization();
        if (aborted) {
          player.trigger({
            type: 'adserror',
            info: aborted
          });
        } else {
          player.trigger('ima3-ready');
        }
      });
    }
  },

  /**
   * Load a given script asynchronously and inform callback when done.
   *
   * @param {string} url The URL to load.
   * @param {function} callback The callback to invoke once loaded.
   */
  loadScript = function(url, callback) {
    var
      script = document.createElement('script'),
      head = document.querySelector('head');

    script.async = true;
    script.src = url;
    script.onload = script.onreadystatechange = function(ignore, isAbort) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;
        script.parentNode.removeChild(script);
        script = null;
        callback(isAbort);
      }
    };
    head.insertBefore(script, head.firstChild);
  },

  /**
   * Translate the IMA event types.
   * @param ima {object} the IMA module object
   */
  eventTypes = plugin.eventTypes = function(ima) {
    var
      types = {},
      translate = function(k) {
        return 'ima3-' + k.toLowerCase().replace(/_/g, '-');
      },
      events = ['AdErrorEvent', 'AdEvent', 'AdsManagerLoadedEvent'],
      i = events.length,
      eventTypes,
      name;

    while (i--) {
      // skip objects that don't follow the event enum pattern
      if (!ima[events[i]] || !ima[events[i]].Type) {
        continue;
      }
      eventTypes = ima[events[i]].Type;
      for (name in eventTypes) {
        if (eventTypes.hasOwnProperty(name)) {
          types[eventTypes[name]] = [eventTypes[name], translate(name)];
        }
      }
    }
    return types;

  },

  /**
   * Pipe all the events in `events` from source onto `player`. Returns a
   * function that unregisters all event listeners.
   */
  pipeEvents = function(source, events, player) {
    var
      k,
      timekeep = 0,
      timestate = true,
      handlers = {},
      typeMap = {
        '0' : 'PREROLL',
        '-1' : 'MIDROLL'
      },
      pipeEvent = function(eventType, eventName) {
        
        var handler = function(event) {  
          player.trigger({
            type: eventName,
            emitter: source,
            originalEvent: event
          });
          //Adding a trigger for translated universal Brightcove events
          player.trigger({
            type: player.ima3.settings.eventMap[eventName],
            emitter: source,
            originalEvent: event     
          });               
          if (player.ima3.currentAd !== undefined) {
            player.ads.ad.id = player.ima3.currentAd.getAdId();
            player.ads.ad.duration = player.ima3.currentAd.getDuration();
            player.ads.ad.currentTime = player.ima3.currentAd.getAdPodInfo().getTimeOffset();
            player.ads.ad.index = (player.ima3.currentAd.getAdPodInfo().getAdPosition())-1;
            player.ads.ad.type = typeMap[player.ima3.currentAd.getAdPodInfo().getTimeOffset()] || 'MIDROLL'; 
            //function to populate the ad Pod values
            player.ads.pod.id = player.ima3.currentAd.getAdPodInfo().getPodIndex();
            player.ads.pod.size = player.ima3.currentAd.getAdPodInfo().getTotalAds();
          }     
        };
        handlers[eventType] = handler;
        source.addEventListener(eventType, handler, false);
      };
    for (k in events) {
      pipeEvent(events[k][0], events[k][1]);
    }
    return function() {
      var k;
      for (k in handlers) {
        source.removeEventListener(k, handlers[k]);
      }
    };
  };

  /**
   * Returns an AdPlayer decorated to proxy calls back and forth to the IMA3
   * iframe.
   * @param elem {HTMLElement} the IMA3 iframe
   * @param options {object} a hash of options to pass to the AdPlayer
   * @return {object} a videojs.ima3.AdPlayer
   */
  videojs.ima3.Html5.adPlayer = function(elem, options) {
    var
      contentPlayer = options.contentPlayer,
      adPlayer = new videojs.ima3.AdPlayer(options),
      _paused = true,
      _volume = 1,
      simulateTimeupdate = function() {
        if (!adPlayer.paused()) {
          adPlayer.trigger('timeupdate');
        }
        window.setTimeout(simulateTimeupdate, 250);
      };

    adPlayer.currentTime = function() {
      var
        duration = adPlayer.duration(),
        remainingTime;

      //If we don't even have a duration, then just return 0.
      if (!duration) {
        return 0;
      }

      remainingTime = contentPlayer.ima3.adsManager.getRemainingTime();
      if (remainingTime <= 0) {
        //Often, remainingTime returns a negative value once the ad has ended. In this
        //case, we will return duration so that the progress bar goes back to empty.
        return 0;
      }

      if (remainingTime > duration) {
        //Since duration is usually rounded by the IMA SDK to an int, but remainingTime
        //is not, remainingTime is slightly more than the duration sometimes and needs
        //to be handled else we will have a negative remaining time.
        return 0;
      }

      if (remainingTime > 0) {
        //otherwise remainingTime is a positive valid value, so we can perform the calculation
        //to get currentTime.
        return duration - remainingTime;
      }

    };
    adPlayer.duration = function() {
      var
        ad = contentPlayer.ima3.currentAd,
        adDuration;

      if (ad) {
        adDuration = ad.getDuration();
        return adDuration > 0 ? adDuration : 0;
      }
      return 0;
    };
    adPlayer.pause = function() {
      _paused = true;
      contentPlayer.ima3.adsManager.pause();
    };
    adPlayer.paused = function() {
      return _paused;
    };
    adPlayer.play = function() {
      _paused = false;
      contentPlayer.ima3.adsManager.resume();

      // 2-2-2014: IMA3 is not firing RESUMED so we trigger play manually
      adPlayer.trigger('play');
    };
    adPlayer.isFullscreen = function() {
      return contentPlayer.isFullscreen();
    };
    adPlayer.requestFullscreen = function() {
      return contentPlayer.requestFullscreen();
    };
    adPlayer.volume = function(value) {
      if (value !== undefined) {
        contentPlayer.ima3.adsManager.setVolume(value);
        _volume = value;
        adPlayer.trigger('volumechange');
      }
      return _volume;
    };

    // translate IMA3 events into ad player events
    //Note as pe BC-35272 instead of player.removeClass/addClass we should be using contentPlayer.removeClass/removeClass as player is not defined.
    contentPlayer.on('ima3-started', function() {
      contentPlayer.removeClass('vjs-ima3-paused');
      adPlayer.trigger('play');
      _paused = false;
    });
    contentPlayer.on('ima3-resumed', function() {
      contentPlayer.removeClass('vjs-ima3-paused');
      adPlayer.trigger('play');
      _paused = false;
    });
    contentPlayer.on('ima3-paused', function() {
      contentPlayer.addClass('vjs-ima3-paused');
      adPlayer.trigger('pause');
      _paused = true;
    });

    // trigger timeupdates regularly during playback
    simulateTimeupdate();
    return adPlayer;
  };
})(window, document, window.videojs);
