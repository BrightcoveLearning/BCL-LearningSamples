/**
 * The javascript-portion of the IMA3 Flash SDK integration. This object is
 * responsible for proxying data back and forth with the integration SWF and
 * displaying it properly during the playback lifecyle.
 */
(function(window, videojs, undefined) {
  var objectPath = function(obj, path) {
    var retObj = obj,
        paths = path.split('.'),
        i = 0;

    for (; i < paths.length; i++) {
      if (!retObj[paths[i]]) {
        retObj[paths[i]] = {};
      }

      retObj = retObj[paths[i]];
    }

    return retObj;
  };

  /**
   * The IMA3 Flash integration initializer.
   * @param {object} options the configuration overrides to apply
   */
  videojs.ima3.Flash = function(options) {
    var
      player = this,
      div = document.createElement('div'),
      params =
        '<param name="flashvars" value="playerId=' + player.el().id + '&debug=' + player.ima3.settings.debug + '">' +
        '<param name="wmode" value="transparent">' +
        '<param name="AllowScriptAccess" value="always">',
      id = player.el().id + '-ima3-flash',
      ControlBar = videojs.getComponent('ControlBar'),
      adControlBar,
      adPlayer,
      object,
      prefixRelativeProtocol = function(url) {
        if (url && !(/^https?:|file:/).test(url)) {
          return window.location.protocol + url;
        }
        return url;
      },
      postrollAdtimeoutHandler = function() {
        object.vjs_postrolltimeout();
      },
      interval,
      adRequest,
      // Resuable Function below to reset the ad meta data
      resetAdMetaData = function(player) {
        player.ads.ad = {};
        player.ads.pod = {};
      };
      
    //Handle on-demand ad requests (i.e. from id3 metadata)
    adRequest = function(adTag) {
      player.ima3.ready(function() {
        resetAdMetaData(player);
        object.vjs_trigger({
          type: 'adrequest',
          adTag: player.ima3.adMacroReplacement(prefixRelativeProtocol(adTag)),
          currentTime: player.currentTime(),
          options: {}
        });
      });
    };

    // Create deprecated vjs-global version of adrequest
    videojs.ima3.Flash.adrequest = function() {
      videojs.log.warn('videojs.ima3.Flash.adrequest is deprecated. Use player.ima3.adrequest instead.');
      return adRequest.apply(this, arguments);
    };

    // Create player-local adrequest function
    player.ima3.adrequest = player.ima3.makeAdRequestFunction(adRequest);

    options.serverUrl = prefixRelativeProtocol(options.serverUrl);

    div.className = 'vjs-ima3-ad-background';

    // create a cross-browser friendly SWF embed
    div.innerHTML =
      '<!--[if !IE]>-->' +
      '<object width="100%" height="100%" type="application/x-shockwave-flash" data="' +
      options.adSwf + '">' +
      params +
      '</object>' +
      '<!--<![endif]-->';

    object = div.querySelector('object');
    if (!object) {
      // build an embed for IE<10
      div.innerHTML =
        '<object width="100%" height="100%" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
        '  <param name="movie" value="' + options.adSwf + '">' +
        params +
        '</object>';
      object = div.querySelector('object');
    }
    object.id = id;
    object.name = id;
    object.className = 'vjs-ima3-ad-container vjs-ima3-flash-ad-container';

    objectPath(window, 'google.ima.ImaSdkSettings').setAutoPlayAdBreaks = function(autoplayAdBreaks) {
      object.vjs_autoplayadbreaks(autoplayAdBreaks);
    };

    objectPath(window, 'google.ima.AdsManager').getRemainingTime = function() {
      return object.vjs_getRemainingTime();
    };

    objectPath(window, 'google.ima.AdsManager').destroy = function() {
      return object.vjs_destroyAdsManager();
    };

    //insert the entire div containing the swf object behind player controls
    player.el().insertBefore(div, player.el().querySelector('.vjs-big-play-button'));

    // create the custom ads controls
    adPlayer = videojs.ima3.Flash.adPlayer(object, {
      contentPlayer: player
    });
    adControlBar = new ControlBar(adPlayer, options.adControlBar);
    adControlBar.addClass('vjs-ad-control-bar');
    player.addClass('vjs-ad-controls');
    player.addChild(adControlBar);

    // translate events between the content player and the ad player
    player.on('adstart', function(event) {
      // pause the content player so it doesn't play in the background
      player.pause();
    });
    player.on('adend', function() {
      // Reset ad metatdata
    });
    //Nulling out the values for the ad and pod object
    player.on(['contentupdate', 'adend', 'ima3-ready'], function() {
      resetAdMetaData(player);
    });
    // trigger contentupdate once the swf is ready
    interval = window.setInterval(function() {
      var forwardEvent = function(event) {
        object.vjs_trigger({
          type: event.type,
          // send along options with each forwarded event to keep the
          // swf up to date with the current settings
          options: {
            serverUrl: player.ima3.adMacroReplacement(player.ima3.settings.serverUrl)
          }
        });
      };

      if (object.vjs_trigger) {
        player.trigger('ima3-ready');
        window.clearInterval(interval);
        // pass along ad-related events
        player.on('readyforpreroll', forwardEvent);
        // only forward ended events that are from content
        player.on('contentended', function(event) {
          player.trigger(player.ima3.settings.eventMap[event.type]);
          if (player.ads.state === 'postroll?') {
            player.one('adtimeout', postrollAdtimeoutHandler);
            event.type = 'ended';
            forwardEvent(event);
          }
        });

        player.on(['contentupdate', 'dispose'], function() {
          player.off('adtimeout', postrollAdtimeoutHandler);
        });

        // forward timeupdate events with the currentTime
        player.on('timeupdate', function(event) {
          object.vjs_trigger({
            type: event.type,
            currentTime: player.currentTime()
          });
        });

        // only forward contentupdate events if the src has changed since
        // the last time we sent one to the swf.
        player.on('contentupdate', function(event) {
          var currentSrc = player.currentSrc();
          //Resetting the ad and ad pod object
          resetAdMetaData(player);
          if (player.ima3.currentSrc !== currentSrc) {
            player.ima3.currentSrc = currentSrc;
            if (options.requestMode === 'onplay') {
              player.one('play', function(event) {
                // this calls vjs_trigger contentupdate which then calls AdsLoader to request ads
                forwardEvent({type: 'contentupdate'});
              });
            } else if (options.requestMode === 'onload') {
              forwardEvent(event);
            }
          }
        });

        // if there is a src set when the plugin initialized immediately
        // trigger a contentupdate event to get the ads for it.  Otherwise,
        // the contentupdate handler above will take care of it once it is
        // detected by contrib-ads.
        player.ready(function() {
          var currentSrc = player.currentSrc();
          player.ads.ad = {};
          player.ads.pod = {};
          if (currentSrc && (player.ima3.currentSrc !== currentSrc)) {
            player.ima3.currentSrc = currentSrc;
            if (options.requestMode === 'onplay') {
              player.one('play', function() {
                // this calls vjs_trigger contentupdate which then calls AdsLoader to request ads
                forwardEvent({type: 'contentupdate'});
              });
            } else if (options.requestMode === 'onload') {
              forwardEvent({type: 'contentupdate'});
            }
          }
        });
        player.on('debug', function(event) {
          object.vjs_trigger({
            type: event.type,
            enable: event.enable
          });
        });
      }
    }, 50);

    // export IMA3 objects
    player.ima3.adControlBar = adControlBar;
    player.ima3.adPlayer = adPlayer;
    player.ima3.el = object;
    player.ima3.adsManager = google.ima.AdsManager;
  };

  /**
   * Returns an AdPlayer decorated to proxy calls back and forth with the SWF.
   * @param elem {HTMLElement} the IMA3 object element
   * @param options {object}  a hash of options to pass to the AdPlayer
   * @return {object} a videojs.ima3.AdPlayer
   */
  videojs.ima3.Flash.adPlayer = function(elem, options) {
    var
      contentPlayer = options.contentPlayer,
      adPlayer = new videojs.ima3.AdPlayer(options),
      _currentTime = 0,
      _duration = -1,

      /**
       * Return a function that invokes the method with the specified name on
       * the player object. If the method is not present, the fallback value is
       * returned.
       * @param {string} name the name of the method to invoke
       * @param {object} fallback the value to return if the method is not
       * defined
       */
      proxyCall = function(name, fallback) {
        return function() {
          var method = 'vjs_' + name;
          if (elem[method]) {
            return elem[method].apply(elem, Array.prototype.slice.call(arguments));
          } else {
            return fallback;
          }
        };
      },
      proxyDuration = proxyCall('duration', -1),
      proxyCurrentTime = proxyCall('currentTime'),
      proxyPause = proxyCall('pause'),
      proxyPlay = proxyCall('play'),
      proxyVolume = proxyCall('volume', 1);

    // using ExternalInterface can be expensive so we estimate our current
    // playhead position here in javascript and then sync back up with the
    // SWF less frequently
    (function() {
      var
        lastTime,
        running = false,
        updateInterval = 250,
        adInfo,
        typeMap = {
          '0' : 'PREROLL',
          '-1' : 'POSTROLL'
        },

        runUpdate = function() {
          if (running) {
            updateCurrentTime();
            window.setTimeout(runUpdate, updateInterval);
          }
        },

        updateCurrentTime = function() {
          var now = +new Date();
          _currentTime += now - lastTime;
          lastTime = now;
          adPlayer.trigger('timeupdate');
        };

      //Function to populate the ad metadata into the contrib-ad BC object       
      adInfo = function(eventName) {
        //Ad data below
        if(contentPlayer.ima3.currentAd !== undefined) {        
          contentPlayer.ads.ad.id = contentPlayer.ima3.currentAd.id;
          contentPlayer.ads.ad.duration = contentPlayer.ima3.currentAd.duration;
          //Contrib Ads defines it 0 based but IMA gives us value which starts at 1 instead of 0
          contentPlayer.ads.ad.index = (contentPlayer.ima3.currentAd.adPodInfo.adPosition) - 1;
          contentPlayer.ads.ad.type = typeMap[contentPlayer.ima3.currentAd.adPodInfo.timeOffset] || 'MIDROLL';
          //Ad Pod data below
          contentPlayer.ads.pod.id = contentPlayer.ima3.currentAd.adPodInfo.podIndex;
          contentPlayer.ads.pod.size = contentPlayer.ima3.currentAd.adPodInfo.totalAds;         
        }
        //Triggering the translated BC contrib-ad-event here
        contentPlayer.trigger(contentPlayer.ima3.settings.eventMap[eventName.type]);                
      };
           
      adPlayer.on('play', function() {
        contentPlayer.removeClass('vjs-ima3-paused');
        running = true;
        lastTime = +new Date();
        window.setTimeout(runUpdate, updateInterval);
      });

      adPlayer.on('pause', function() {
        contentPlayer.addClass('vjs-ima3-paused');
        running = false;
      });

      adPlayer.on('ima3-started', function(event) {
        _currentTime = 0;
        lastTime = +new Date();
        adInfo(event);        
      });
      
      //Additional Flash contrib ad BC events below
      adPlayer.on('ima3-resumed', adInfo);        
      adPlayer.on('ima3-paused', adInfo);   
      adPlayer.on('ima3-first-quartile', adInfo);          
      adPlayer.on('ima3-midpoint', adInfo);        
      adPlayer.on('ima3-third-quartile', adInfo);  
      adPlayer.on('ima3-volume-changed', adInfo); 
      adPlayer.on('ima3-click', adInfo);   
      adPlayer.on('ima3-complete', adInfo);           
      adPlayer.on('ima3-all-ads-completed', adInfo);
      adPlayer.on('ads-request', adInfo);
      adPlayer.on('ads-load', adInfo);
      adPlayer.on('ads-pod-ended', adInfo);
      adPlayer.on('ads-pod-started', adInfo);      

    })();// End anonymous function

    /**
    * Calculates the current time using _currentTime and duration.
    */
    adPlayer.currentTime = function() {
      return Math.min(_currentTime / 1000, adPlayer.duration());
    };

    // cache duration since we need to reference it frequently
    adPlayer.on('durationchange', function() {
        var proxyTime = proxyCurrentTime(),
            currentAdTime = proxyTime < 0 ? 0 : proxyTime;
      _duration = proxyDuration();
      _currentTime = currentAdTime * 1000; // converted to milliseconds
    });
    adPlayer.on('ima3-started', function() {
      contentPlayer.removeClass('vjs-ima3-paused');
      _duration = proxyDuration();
    });
    adPlayer.on('adserror', function() {
      contentPlayer.trigger('adserror');
    });
    adPlayer.on('adscanceled', function() {
      contentPlayer.trigger('adscanceled');
    });
    adPlayer.duration = function() {
      if (_duration < 0) {
        _duration = proxyDuration();
      }
      return _duration;
    };
    adPlayer.isFullscreen = function() {
      return contentPlayer.isFullscreen();
    };
    adPlayer.requestFullscreen = function() {
      return contentPlayer.requestFullscreen();
    };
    // proxy methods to the object element
    adPlayer.volume = function(value) {
      var currentVolume = proxyVolume();
      if (value !== undefined && value !== currentVolume) {
        proxyVolume(value);
        adPlayer.trigger('volumechange');
      } else {
        return currentVolume;
      }
    };
    adPlayer.pause = proxyCall('pause');
    adPlayer.paused = proxyCall('paused');
    adPlayer.play = proxyCall('play');

    return adPlayer;
  };
})(window, window.videojs);
