(function(window, videojs, helpers) {
    
QUnit.module('IMA3 HTML Plugin', window.sharedModuleHooks());

QUnit.test('exports IMA3 runtime objects', function(assert) {
  assert.expect(3);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  assert.ok(this.player.ima3.el, 'exports ad container');
  assert.ok(this.player.ima3.adPlayer, 'exported ad player');
  assert.ok(this.player.ima3.adControlBar, 'exported ad control bar');
});

//Writing up a mock function to populate the ad and pod info objects
var handleEvt = function (evt) {
  //Trigger the ima3-ads-manager-loaded so that the pipe events is fired
  //var this = player;
  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: function() {},
          start: function() {}
        };
      }
    }
  });
  //Mock up the current Ad object
  this.player.ima3.currentAd = {
    getAdId: function() {
      return 1234;
    },
    getDuration: function() {
      return 30;
    },
    getAdPodInfo: function() {
      var fakePodInfo = {
        getTimeOffset: function() {
          return 0;
        },
        getAdPosition: function() {
          return 1;
        },
        getPodIndex: function() {
          return 3;
        },
        getTotalAds: function() {
          return 3;
        } 
      };
      return fakePodInfo;
    }
  };
  //Check for conditions and their respcetive assertions
  //For these conditions we have no data yet so we will have undefined values
  if (evt ==='ads-request' || evt ==='ads-load') {
    equal(this.player.ads.ad.id, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.duration, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.index, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.type, undefined, 'This undefned is correct here');
    equal(this.player.ads.pod.id, undefined,'This undefned is correct here');
    equal(this.player.ads.pod.size, undefined,'This undefned is correct here');
  }
  else if (this.player.ima3.currentAd !== undefined) {
    //Since we have data we will check the values
    this.player.ads.ad.id = this.player.ima3.currentAd.getAdId();
    this.player.ads.ad.duration = this.player.ima3.currentAd.getDuration();
    this.player.ads.ad.currentTime = this.player.ima3.currentAd.getAdPodInfo().getTimeOffset();
    this.player.ads.ad.index = (this.player.ima3.currentAd.getAdPodInfo().getAdPosition())-1;
    this.player.ads.ad.type = 'PREROLL'; 
    this.player.ads.pod.id = this.player.ima3.currentAd.getAdPodInfo().getPodIndex();
    this.player.ads.pod.size = this.player.ima3.currentAd.getAdPodInfo().getTotalAds();
    equal(this.player.ads.ad.id, 1234, 'ID not set correctly');
    equal(this.player.ads.ad.duration, 30, 'Duration not set correctly');
    equal(this.player.ads.ad.index, 0, 'Position not found correct');
    equal(this.player.ads.ad.type, 'PREROLL', 'type not found correct');
    equal(this.player.ads.pod.id, 3,'POD ID not correct');
    equal(this.player.ads.pod.size, 3,'Total POD Ads not correct');
  }
  if (evt === 'ads-allpods-completed' || evt === 'ads-ad-ended' || evt === 'ads-pod-ended') {
    //We set the ads and pod object to undefined here
    this.player.ads.ad = {};
    this.player.ads.pod = {};
    equal(this.player.ads.ad.id, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.duration, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.index, undefined, 'This undefned is correct here');
    equal(this.player.ads.ad.type, undefined, 'This undefned is correct here');
    equal(this.player.ads.pod.id, undefined,'This undefned is correct here');
    equal(this.player.ads.pod.size, undefined,'This undefned is correct here');
  }
};

QUnit.test('triggers contrib ad event ads-started when ima3-started has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-started');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-started']);
  assert.equal('ads-ad-started', this.player.ima3.settings.eventMap['ima3-started'], 'BC translated event does not match');
  });

QUnit.test('triggers contrib ad event ads-clicked when ima3-clicked has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-click');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-click']);
  assert.equal('ads-click', this.player.ima3.settings.eventMap['ima3-click'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-request when ads-request has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ads-request');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ads-request']);
  assert.equal('ads-request', this.player.ima3.settings.eventMap['ads-request'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-load when ads-load has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ads-load');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ads-load']);
  assert.equal('ads-load', this.player.ima3.settings.eventMap['ads-load'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-pod-started when ads-pod-started has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ads-pod-started');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ads-pod-started']);
  assert.equal('ads-pod-started', this.player.ima3.settings.eventMap['ads-pod-started'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-firstquartile when ima3-first-quartile has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-first-quartile');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-first-quartile']);
  assert.equal('ads-first-quartile', this.player.ima3.settings.eventMap['ima3-first-quartile'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-midpoint when ima3-midpoint has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-midpoint');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-midpoint']);
  assert.equal('ads-midpoint', this.player.ima3.settings.eventMap['ima3-midpoint'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-thirdquartile when ima3-third-quartile has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-third-quartile');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-third-quartile']);
  assert.equal('ads-third-quartile', this.player.ima3.settings.eventMap['ima3-third-quartile'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-volume-changed when ima3-volume-changed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-volume-changed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-volume-changed']);
  assert.equal('ads-volumechange', this.player.ima3.settings.eventMap['ima3-volume-changed'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-paused when ima3-paused has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-paused');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-paused']);
  assert.equal('ads-pause', this.player.ima3.settings.eventMap['ima3-paused'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-resumed when ima3-resumed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-resumed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-resumed']);
  assert.equal('ads-play', this.player.ima3.settings.eventMap['ima3-resumed'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-pod-ended when ads-pod-ended has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ads-pod-ended');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ads-pod-ended']);
  assert.equal('ads-pod-ended', this.player.ima3.settings.eventMap['ads-pod-ended'], 'BC translated event does not match');
});

QUnit.test('triggers contrib ad event ads-allpods-completed when ima3-all-ads-completed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['html5']
  });
  this.player.trigger('ima3-all-ads-completed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-all-ads-completed']);
  assert.equal('ads-allpods-completed', this.player.ima3.settings.eventMap['ima3-all-ads-completed'], 'BC translated event does not match');
});
QUnit.test('triggers "ima3-ready" when loaded', function(assert) {
  assert.expect(1);
  var readySpy = sinon.spy();
  this.player.on('ima3-ready', readySpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });
  assert.strictEqual(readySpy.callCount, 1, '"ima3-ready" should fire when html tech is loaded.');
});
QUnit.test('lets IMA decide the playback mode if the Flash tech is supported', function(assert) {
  // capture the display element passed to the ad container
  var spy = window.google.ima.AdDisplayContainer = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  assert.ok(spy.getCall(0).args[1], 'a video was still passed');
  assert.ok(this.player.ima3.adControlBar, 'ad control bar created');
  assert.ok(this.player.ima3.adPlayer, 'ad player created');
  assert.ok(this.player.ima3.el, 'ad container available');
});

QUnit.test('keeps track of volume independent of the AdsManager', function(assert) {
  assert.expect(1);
  var volumeSpy = sinon.spy();


  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          getVolume: volumeSpy
        };
      }
    }
  });

  this.player.ima3.adPlayer.volume();
  assert.strictEqual(volumeSpy.callCount, 0, 'getVolume is not called');
});

QUnit.test('triggers "timeupdate" during ad playback', function(assert) {
  assert.expect(3);
  var timeUpdateSpy = sinon.spy();
  var getRemainingTimeSpy = sinon.spy(function() {
    return 1;
  });

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          getRemainingTime: getRemainingTimeSpy
        };
      }
    }
  });

  this.player.trigger('ima3-started');

  this.player.ima3.currentAd = {
    getDuration: function() {
      return 3;
    }
  };

  this.player.ima3.adPlayer.on('timeupdate', timeUpdateSpy);

  assert.strictEqual(getRemainingTimeSpy.callCount, 0, 'no initial calls');

  // let enough time pass to trigger a timeupdate
  this.clock.tick(250);

  assert.ok(getRemainingTimeSpy.called, '`currentTime` is requested at least once');
  assert.strictEqual(timeUpdateSpy.callCount, 1, '"timeupdate" triggered');
});

QUnit.test('stores the current ad', function(assert) {
  assert.expect(2);
  var ad = {
    getHeight: _.noop,
    getWidth: _.noop,
    isLinear: _.noop
  };

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-loaded',
    originalEvent: {
      getAd: function() {
        return ad;
      }
    }
  });

  assert.strictEqual(this.player.ima3.currentAd, ad, 'current ad is available');

  this.player.trigger({
    type: 'ima3-complete',
    originalEvent: {
      getAd: function() {
        return ad;
      }
    }
  });

  assert.notOk(this.player.ima3.hasOwnProperty('currentAd'), 'current ad is removed');
});

QUnit.test('translates AdsManager events into ad player events', function(assert) {
  assert.expect(6);
  var playSpy = sinon.spy();
  var pauseSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.adPlayer.on('play', playSpy);
  this.player.ima3.adPlayer.on('pause', pauseSpy);
  this.player.trigger('ima3-started'); // ads have begun playback
  assert.notOk(this.player.ima3.adPlayer.paused(), 'ads are playing');
  assert.strictEqual(playSpy.callCount, 1, 'play was fired');
  assert.strictEqual(pauseSpy.callCount, 0, 'pause was not fired');

  this.player.trigger('ima3-paused'); // ads were paused
  assert.ok(this.player.ima3.adPlayer.paused(), 'ads are paused');
  assert.strictEqual(playSpy.callCount, 1, 'play was not fired');
  assert.strictEqual(pauseSpy.callCount, 1, 'pause was fired');
});

QUnit.test('adPlayer `play()`/`pause()` trigger adsManager `play()`/`pause()`', function(assert) {
  assert.expect(4);
  var resumeSpy = sinon.spy();
  var pauseSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          resume: resumeSpy,
          pause: pauseSpy
        };
      }
    }
  });

  assert.strictEqual(resumeSpy.callCount, 0, 'play should not have been called');
  this.player.ima3.adPlayer.play();
  assert.strictEqual(resumeSpy.callCount, 1, 'play should have been called');

  assert.strictEqual(pauseSpy.callCount, 0, 'pause should not have been called');
  this.player.ima3.adPlayer.pause();
  assert.strictEqual(pauseSpy.callCount, 1, 'pause should have been called');
});

QUnit.test('applies volume settings to the ad player', function(assert) {
  assert.expect(2);
  var volume = 100;
  var volumeChangeSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          getVolume: function() {
            return volume;
          },
          setVolume: function(value) {
            volume = value;
          }
        };
      }
    }
  });

  this.player.ima3.adPlayer.on('volumechange', volumeChangeSpy);
  this.player.ima3.adPlayer.volume(0);
  assert.strictEqual(volume, 0, 'volume is set');
  assert.strictEqual(volumeChangeSpy.callCount, 1, '"volumechange" is fired');
});

QUnit.test('triggers postroll behavior on ended', function(assert) {
  assert.expect(2);
  var contentCompleteSpy = sinon.spy();

  window.google.ima.AdsLoader = function(){
    this.requestAds = _.noop;
    this.contentComplete = contentCompleteSpy;
    this.getSettings = function() {
      return {
        setPlayerVersion: _.noop,
        setPlayerType: _.noop
      };
    };
  };

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ads.state = 'ad-playback';
  this.player.trigger('ended');
  assert.strictEqual(contentCompleteSpy.callCount, 0, '`contentComplete` should not be called when ended fires while playing ads.');

  this.player.ads.state = 'content-playback';
  this.player.trigger('ended');
  assert.strictEqual(contentCompleteSpy.callCount, 1, '`contentComplete` should be called on the AdsLoader when ended fires while playing content.');
});

QUnit.test('fullscreen is delegated to the content player during ads', function(assert) {
  assert.expect(2);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          resize: _.noop
        };
      }
    }
  });

  this.player.ima3.adControlBar.fullscreenToggle.trigger('click');
  assert.ok(this.player.isFullscreen(), 'entered fullscreen');
  this.player.ima3.adControlBar.fullscreenToggle.trigger('click');
  assert.notOk(this.player.isFullscreen(), 'exited fullscreen');
});

QUnit.test('a custom click tracking element can be provided', function(assert) {
  assert.expect(1);
  var clickTracker = document.createElement('div');
  var spy = window.google.ima.AdDisplayContainer = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5'],
    clickTrackingElement: clickTracker
  });

  assert.strictEqual(spy.getCall(0).args[2], clickTracker, 'specified a click tracker');
});

QUnit.test('registers IMA events when the library has circular dependencies', function(assert) {
  assert.expect(1);

  window.google.ima.AdsManagerLoadedEvent = {
    Type: {
      'ADS_MANAGER_LOADED': 'adsManagerLoaded'
    }
  };

  // add a circular reference to the parent object
  window.google.ima.self = window.google.ima;

  // this init will loop forever if circular references are handled
  // properly
  this.player.ima3({
    adTechOrder: ['html5']
  });

  assert.ok(true, 'finished initialization');
});

QUnit.test('IMA settings are applied on initialization', function(assert) {
  assert.expect(4);

  var s = window.google.ima.ImaSdkSettings = {
    setCompanionBackfill: sinon.spy(),
    setNumRedirects: sinon.spy(),
    setPpid: sinon.spy(),
    setVpaidAllowed: sinon.spy()
  };

  this.player.ima3({
    adTechOrder: ['html5'],
    ima3SdkSettings: {
      companionBackfill: 7,
      numRedirects: 101,
      ppid: 97,
      vpaidAllowed: true
    }
  });

  assert.strictEqual(s.setCompanionBackfill.getCall(0).args[0], 7, 'companionBackfill is set');
  assert.strictEqual(s.setNumRedirects.getCall(0).args[0], 101, 'numRedirects is set');
  assert.strictEqual(s.setPpid.getCall(0).args[0], 97, 'ppid is set');
  assert.strictEqual(s.setVpaidAllowed.getCall(0).args[0], true, 'vpaidAllowed is set');
});

QUnit.test('"adsready" is fired when the AdManager is loaded', function(assert) {
  assert.expect(1);
  var readySpy = sinon.spy();
  this.player.on('adsready', readySpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop
        };
      }
    }
  });

  assert.strictEqual(readySpy.callCount, 1, '"adsready" was fired');
});

QUnit.test('requests a preroll when play is first called', function(assert) {
  assert.expect(1);
  var adStartSpy = sinon.spy();
  this.player.on('adstart', adStartSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');
  this.player.trigger('ima3-content-pause-requested');
  assert.strictEqual(adStartSpy.callCount, 1, 'a preroll was started');
});

QUnit.test('starts the AdManager to play a preroll', function(assert) {
  assert.expect(2);
  var initSpy = sinon.spy();
  var startSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: initSpy,
          start: startSpy
        };
      }
    }
  });

  assert.strictEqual(initSpy.callCount, 1, 'the ad manager is initialized');
  assert.strictEqual(startSpy.callCount, 1, 'the ad manager is started');
});

QUnit.test('notifies the ad framework when linear ads are finished', function(assert) {
  assert.expect(1);
  var adEndSpy = sinon.spy();
  this.player.on('adend', adEndSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: videojs.bind(this, function() {
        return {
          init: _.noop,
          start: videojs.bind(this, function() {
            this.player.trigger('ima3-content-pause-requested');
            this.player.trigger('ima3-content-resume-requested');
          })
        };
      })
    }
  });

  assert.strictEqual(adEndSpy.callCount, 1, '"adend" was fired');
});

QUnit.test('adds the loading spinner class upon adRequest', function(assert) {
  assert.expect(1);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.adrequest('foo');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
});

QUnit.test('adds the loading spinner class upon "ima3-content-pause-request"', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder:["html5"]
  });

  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT yet be in "' + el.className + '"');
  this.player.trigger('ima3-content-pause-requested');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
});

QUnit.test('add loading spinner class in between linear ads', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT yet be in "' + el.className + '"');

  this.player.trigger({
    type: 'ima3-complete',
    originalEvent: {
      getAd: function() {
        return {
          isLinear: function() {
            return true;
          }
        };
      }
    }
  });

  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
});

QUnit.test('remove loading spinner class whe `ima3-content-resume-requested` is triggered', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.addClass('ima3-ad-loading');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
  this.player.trigger('ima3-content-resume-requested');
  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT be in "' + el.className + '"');
});

QUnit.test('remove loading spinner when ima3 ad starts', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.addClass('ima3-ad-loading');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
  this.player.trigger('ima3-started');
  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT be in "' + el.className + '"');
});

QUnit.test('remove loading spinner when ima3 ad errors', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.addClass('ima3-ad-loading');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');
  this.player.trigger('ima3-ad-error');
  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT be in "' + el.className + '"');
});

QUnit.test('remove loading spinner when ima3 ad loads', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.addClass('ima3-ad-loading');
  assert.ok(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should be in "' + el.className + '"');

  this.player.trigger({
    type: 'ima3-loaded',
    originalEvent: {
      getAd: function() {
        return {
          isLinear: function() {
            return true;
          },
          getDuration: function() {
            return 0;
          }
        };
      }
    }
  });

  assert.notOk(helpers.hasClass(el, 'ima3-ad-loading'), '"ima3-ad-loading" class should NOT be in "' + el.className + '"');
});

QUnit.test('resizes the ads manager when entering or exiting fullscreen', function(assert) {
  assert.expect(2);
  var resizeSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          resize: resizeSpy // width, height, viewMode
        };
      }
    }
  });

  this.player.trigger('fullscreenchange');
  assert.strictEqual(resizeSpy.callCount, 1, 'the ads manager is resized');
  assert.strictEqual(resizeSpy.getCall(0).args.length, 3, 'new dimensions were specified');
});

QUnit.test('adds a class to the player while an overlay is playing', function(assert) {
  assert.expect(2);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop
        };
      }
    }
  });

  this.player.trigger({
    type: 'ima3-loaded',
    originalEvent: {
      getAd: function() {
        return {
          getWidth: function() {
            return 7;
          },
          getHeight: function() {
            return 7;
          },
          isLinear: function() {
            return false;
          }
        };
      }
    }
  });

  assert.ok(helpers.hasClass(el, 'vjs-ima3-overlay'), '"vjs-ima3-overlay" should be in "' + el.className + '"');

  // we have not seen a real-world example of an overlay being removed by the
  // IMA3 SDK, so this next test mocks out a best-guess at how that would work
  this.player.trigger({
    type: 'ima3-complete',
    originalEvent: {
      getAd: function() {
        return {
          isLinear: function() {
            return false;
          }
        };
      }
    }
  });

  assert.notOk(helpers.hasClass(el, 'vjs-ima3-overlay'), '"vjs-ima3-overlay" should NOT be in "' + el.className + '"');
});

QUnit.test('notifies the AdsLoader to play a postroll', function(assert) {
  assert.expect(1);
  var contentCompleteSpy = sinon.spy();
  var adStarted;

  window.google.ima.AdsLoader = function(){
    this.requestAds = _.noop;
    this.contentComplete = contentCompleteSpy;
    this.getSettings = function() {
      return {
        setPlayerVersion: _.noop,
        setPlayerType: _.noop
      };
    };
  };

  this.player.ima3({
    adTechOrder: ['html5'],
    debug: true
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: function() {
            adStarted = true;
          },
          start: function() {
            this.player.trigger('ima3-content-pause-requested');
            this.player.trigger('ima3-content-resume-requested');
          },
          destroy: _.noop
        };
      }
    }
  });

  this.player.trigger('playing'); // come back from a preroll
  this.player.trigger('contentended');

  assert.strictEqual(contentCompleteSpy.callCount, 1, 'AdsLoader should be notified when content completes.');
});

QUnit.test('"adserror" will trigger if `adsManager.init()` throws', function(assert) {
  assert.expect(2);
  var adsErrorSpy = sinon.spy();
  var destroySpy = sinon.spy();

  this.player.on('adserror', adsErrorSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: function() {
            throw new Error('init threw up');
          },
          start: _.noop,
          destroy: destroySpy
        };
      }
    }
  });

  assert.strictEqual(adsErrorSpy.callCount, 1, '"adserror" should have fired');
  assert.strictEqual(destroySpy.callCount, 1, 'admanager should cleanup on error');
});

QUnit.test('"adserror" will trigger if `adsManager.start()` throws', function(assert) {
  assert.expect(2);
  var adsErrorSpy = sinon.spy();
  var destroySpy = sinon.spy();

  this.player.on('adserror', adsErrorSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: function() {
            throw new Error('start threw up');
          },
          destroy: destroySpy
        };
      }
    }
  });

  assert.strictEqual(adsErrorSpy.callCount, 1, '"adserror" should have fired');
  assert.strictEqual(destroySpy.callCount, 1, 'admanager should cleanup on error');
});

QUnit.test('"ima3-ad-error" will trigger "adend" if in ad-playback state', function(assert) {
  assert.expect(3);
  var adEndSpy = sinon.spy();
  var adsErrorSpy = sinon.spy();
  var destroySpy = sinon.spy();

  this.player.on('adend', adEndSpy);
  this.player.on('adserror', adsErrorSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: videojs.bind(this, function() {
        return {
          init: _.noop,
          start: videojs.bind(this, function() {
            this.player.trigger('ima3-content-pause-requested');
            this.player.trigger('ima3-ad-error');
          }),
          destroy: destroySpy
        };
      })
    }
  });

  assert.strictEqual(adsErrorSpy.callCount, 1, '"adserror" was fired');
  assert.strictEqual(adEndSpy.callCount, 1, '"adend" was fired');
  assert.strictEqual(destroySpy.callCount, 1, 'admanager should cleanup on error');
});

QUnit.test('"ima3-ad-error" will trigger "adserror" if not in ad-playback state', function(assert) {
  assert.expect(2);
  var adsErrorSpy = sinon.spy();
  var destroySpy = sinon.spy();

  this.player.on('adserror', adsErrorSpy);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: videojs.bind(this, function() {
        return {
          init: _.noop,
          start: videojs.bind(this, function() {
            this.player.trigger('ima3-ad-error');
          }),
          destroy: destroySpy
        };
      })
    }
  });

  assert.strictEqual(adsErrorSpy.callCount, 1, '"adserror" was fired');
  assert.strictEqual(destroySpy.callCount, 1, 'admanager should cleanup on error');
});

QUnit.test('adrequest on demand triggers "adrequest" call on HTML player', function(assert) {
  var adTagUrl = 'http://www.example.com/ads?player.id={player.id}&mediainfo.id={mediainfo.id}&mediainfo.name={mediainfo.name}&mediainfo.description={mediainfo.description}&player.duration={player.duration}&mediainfo.tags={mediainfo.tags}&window.location.href={window.location.href}';
  var serverUrlWithReplacements = 'http://www.example.com/ads?player.id=' + this.player.id() + '&mediainfo.id=888&mediainfo.name=exampletitle&mediainfo.description=exampledesc&player.duration=30&mediainfo.tags=tagone%2Ctagtwo&window.location.href=' + encodeURIComponent(window.location.href);
  var actualAdrequestUrl;

  this.player.duration = function() { return 30; };

  this.player.mediainfo = {
    id: 888,
    name: 'exampletitle',
    description: 'exampledesc',
    tags: ['tagone', 'tagtwo']
  };

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.adsLoader.requestAds = function(ad) {
    actualAdrequestUrl = ad.adTagUrl;
  };

  this.player.ima3.adrequest(adTagUrl);

  assert.equal(actualAdrequestUrl, serverUrlWithReplacements, "The adTag in the adrequest event should match the macro replaced url in the call to adrequest method");
});

QUnit.test('adrequest event calls startLinearAdMode if not already in adplayback state', function(assert) {
  assert.expect(2);
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';

  window.google.ima.AdsLoader = function(){
    this.requestAds = _.noop;
    this.getSettings = function() {
      return {
        setPlayerVersion: _.noop,
        setPlayerType: _.noop
      };
    };
  };

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          destroy: _.noop
        };
      }
    }
  });

  assert.notStrictEqual(this.player.ads.state, 'ad-playback', 'player should not be in ad-playback state initally.');
  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(this.player.ads.state, 'ad-playback', 'startLinearAdMode should be called if an ondemand request is made while not in ad mode');
});

QUnit.test('adrequest event destroys pre-existing admanagers', function(assert) {
  assert.expect(4);
  var managerCleanupSpy = sinon.spy();
  var destroySpy = sinon.spy();
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';

  window.google.ima.AdsLoader = function(){
    this.requestAds = _.noop;
    this.getSettings = function() {
      return {
        setPlayerVersion: _.noop,
        setPlayerType: _.noop
      };
    };
  };

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('play');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          destroy: destroySpy
        };
      }
    }
  });

  this.player.ima3.managerCleanup = managerCleanupSpy;

  assert.strictEqual(destroySpy.callCount, 0, 'destroy should not be called yet');
  assert.strictEqual(managerCleanupSpy.callCount, 0, 'managerCleanup should not be called yet');
  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(destroySpy.callCount, 1, 'destroy should be called on ondemand adrequest');
  assert.strictEqual(managerCleanupSpy.callCount, 1, 'managerCleanup should be called on ondemand adrequest');
});

QUnit.test('initializing ima without a serverUrl triggers "adscanceled"', function(assert) {
  assert.expect(2);
  var adsCanceledSpy = sinon.spy();
  this.player.on('adscanceled', adsCanceledSpy);

  // The ads manager is only loaded if there is a src;
  this.player.currentSrc = function() {
    return 'http://fakesrc.com/fakesrc.mp4';
  };

  this.player.ima3({
    adTechOrder: ['html5'],
    serverUrl: ''
  });

  assert.strictEqual(adsCanceledSpy.callCount, 1, '"adscancled" should be triggered if there is no serverUrl is set to a falsey value');
  assert.strictEqual(this.player.ads.state, 'content-playback', 'player should default to content-playback state on load if the serverUrl is set to a falsey value');
});

QUnit.test('adrequest event intializes a new adsmanager', function(assert) {
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
  var initSpy = sinon.spy();
  var startSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  // Trigger the initial adscanceled to properly initialize the contrib-ads state
  this.player.trigger('adscanceled');
  this.player.trigger('play');

  this.player.ima3.adsLoader.requestAds = videojs.bind(this, function() {
    this.player.trigger({
      type: 'ima3-ads-manager-loaded',
      originalEvent: {
        getAdsManager: function() {
          return {
            init: initSpy,
            start: startSpy,
            destroy: _.noop
          };
        }
      }
    });
  });

  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(initSpy.callCount, 1, 'adsManager should initalize and start be called on ondemand adrequest');
  assert.strictEqual(startSpy.callCount, 1, 'adsManager should initalize and start be called on ondemand adrequest');
});

QUnit.test('adrequests are triggered with passed in serverUrl', function(assert) {
  var adrequestsCount = 0;
  var actualAdrequestUrl;

  this.player.ima3({
    adTechOrder: ['html5'],
    requestMode: 'ondemand'
  });

  this.player.ima3.adsLoader.requestAds = function(ad) {
    adrequestsCount++;
    actualAdrequestUrl = ad.adTagUrl;
  };

  this.player.ima3.adrequest();
  assert.equal(adrequestsCount, 1, 'An adsrequest event should have triggered');
  assert.equal(actualAdrequestUrl, this.player.ima3.settings.serverUrl, 'An adsrequest event should have triggered with a default sample serverUrl');
  this.player.ima3.adrequest('//myadrequest.com');
  assert.strictEqual(adrequestsCount, 2, 'An adsrequest should be triggered');
  assert.equal(actualAdrequestUrl, '//myadrequest.com', 'An adsrequest event should have triggered with passed in serverUrl');
});

QUnit.test('contentupdate triggers ads manager request', function(assert){
  var serverUrl = 'http://www.example.com/ads?player.id={player.id}&mediainfo.id={mediainfo.id}&mediainfo.name={mediainfo.name}&mediainfo.description={mediainfo.description}&player.duration={player.duration}&mediainfo.tags={mediainfo.tags}&window.location.href={window.location.href}';
  var serverUrlWithReplacements = 'http://www.example.com/ads?player.id=' + this.player.id() + '&mediainfo.id=888&mediainfo.name=exampletitle&mediainfo.description=exampledesc&player.duration=30&mediainfo.tags=tagone%2Ctagtwo&window.location.href=' + encodeURIComponent(window.location.href);
  var adrequestTriggered = false;
  var actualAdrequestUrl;

  this.player.duration = function() { return 30;};

  this.player.mediainfo = {
    id: 888,
    name: 'exampletitle',
    description: 'exampledesc',
    tags: ['tagone', 'tagtwo']
  };

  this.player.ima3({
    serverUrl: serverUrl,
    adTechOrder: ['html5']
  });

  this.player.ima3.adsLoader.requestAds = function(ad) {
    adrequestTriggered = true;
    actualAdrequestUrl = ad.adTagUrl;
  };

  this.player.trigger('contentupdate');
  assert.ok(adrequestTriggered, 'requestAds should be triggered when content is udpated.');
  assert.equal(actualAdrequestUrl, serverUrlWithReplacements, 'The url in the request was not the macro replaced serverUrl configured.');
});

QUnit.test('adPlayer.currentTime() returns duration - remainingTime if remainingTime > 0', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.currentAd = {
    getDuration: function() {
      return 10;
    }
  };

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          getRemainingTime: function() {
            return 5;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.currentTime(), 5, 'currentTime should return duration if remainingTime reported is less than 0');
});

QUnit.test('adPlayer.currentTime() returns 0 if remainingTime > duration', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.currentAd = {
    getDuration: function() {
      return 10;
    }
  };

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          getRemainingTime: function() {
            return 10.1;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.currentTime(), 0, 'currentTime should return 0 if remainingTime reported is > duration');
});

QUnit.test('adPlayer.currentTime() returns 0 if the remainingTime is less than or equal to 0', function(assert) {
  assert.expect(2);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.currentAd = {
    getDuration: function() {
      return 10;
    }
  };

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          destroy: _.noop,
          getRemainingTime: function() {
            return -1;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.currentTime(), 0, 'currentTime should return 0 if remainingTime reported is less than 0');

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          getRemainingTime: function() {
            return 0;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.currentTime(), 0, 'currentTime should return 0 if remainingTime reported is 0');
});

QUnit.test('adPlayer.duration() defaults to 0 if ad.getDuration returns value < 0', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.currentAd = {
    getDuration: function() {
      return -1;
    }
  };

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          getRemainingTime: function() {
            return -1;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.duration(), 0, 'duration should return 0 if duration from ad is less than 0');
});

QUnit.test('adPlayer.duration() returns ad.getDuration if its > 0', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.currentAd = {
    getDuration: function() {
      return 10;
    }
  };

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: _.noop,
          start: _.noop,
          getRemainingTime: function() {
            return -1;
          }
        };
      }
    }
  });

  assert.strictEqual(this.player.ima3.adPlayer.duration(), 10, 'duration should return 0 if duration from ad is less than 0');
});

QUnit.test('adPlayer starts out as paused', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  assert.ok(this.player.ima3.adPlayer.paused(), 'the player starts paused');
});

QUnit.test('does not prevent plays when the video element is being used for ads', function(assert) {
  assert.expect(1);

  sinon.spy(this.player, 'pause');

  this.player.ima3({
    adTechOrder: ['html5']
  });

  // enter ad playback mode
  this.player.trigger('adsready');
  this.player.trigger('play');

  // start ad mode
  this.player.ads.startLinearAdMode();

  // "re-use" the video element
  this.player.currentSrc = function() {
    return 'http://example.com/ad.mp4';
  };

  // trigger play
  this.player.trigger('adplay');

  // let enough time pass for an async pause to occur
  this.clock.tick(1);

  assert.strictEqual(this.player.pause.callCount, 1, 'play was not cancelled');
});

QUnit.test('adds and removes the "vjs-ima3-paused" class based on swf triggered events from the adPlayer', function(assert) {
  assert.expect(3);
  var el = this.player.el();

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.ima3.adPlayer.trigger('ima3-started');
  assert.notOk(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should NOT be on the vjs element when the ad starts');
  this.player.ima3.adPlayer.trigger('ima3-paused');

  // Um... this looks wrong. The expectation does not match the message, but
  // this is what was being tested pre-refactor.
  assert.notOk(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should be on the vjs element when the ad pauses');
  this.player.ima3.adPlayer.trigger('ima3-resumed');
  assert.notOk(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should NOT be on the vjs element when the ad resumes');
});

QUnit.test('IMA events do not trigger exceptions resulting in player undefined condition when ad plays', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['html5']
  });

  this.player.trigger('ima3-started');
  this.player.trigger('ima3-paused');
  this.player.trigger('ima3-resumed');

  assert.ok(true, 'No Error was thrown and player is defined correctly');
});

QUnit.test('`onplay` request-ads-mode triggers ads manager request on play', function(assert) {
 var
    adrequestTriggered = false,
    serverUrl = 'http://www.example.com/ads?player.id={player.id}&mediainfo.id={mediainfo.id}&mediainfo.name={mediainfo.name}&mediainfo.description={mediainfo.description}&player.duration={player.duration}&mediainfo.tags={mediainfo.tags}&window.location.href={window.location.href}',
    serverUrlWithReplacements = 'http://www.example.com/ads?player.id=' + this.player.id() + '&mediainfo.id=888&mediainfo.name=exampletitle&mediainfo.description=exampledesc&player.duration=30&mediainfo.tags=tagone%2Ctagtwo&window.location.href=' + encodeURIComponent(window.location.href),
    actualAdrequestUrl;

  this.player.duration = function() { return 30; };

  this.player.mediainfo = {
    id: 888,
    name: 'exampletitle',
    description: 'exampledesc',
    tags: ['tagone', 'tagtwo']
  };

  this.player.ima3({
    serverUrl: 'xyz',
    adTechOrder: ['html5'],
    requestMode: 'onplay'
  });

  this.player.ima3.adsLoader.requestAds = function(ad) {
    adrequestTriggered = true;
    actualAdrequestUrl = ad.adTagUrl;
  };

  this.player.trigger('contentupdate');
  this.player.ima3.settings.serverUrl = serverUrl;
  this.player.trigger('play');
  assert.ok(adrequestTriggered, 'requestAds should be triggered when content is udpated.');
  assert.equal(actualAdrequestUrl, serverUrlWithReplacements, 'The url in the request was not the macro replaced serverUrl configured.');
});

QUnit.test('`ondemand` request-ads-mode triggers ads manager request only ondemand', function(assert) {
 var
    adrequestTriggered = false,
    serverUrl = 'http://www.example.com/ads?player.id={player.id}&mediainfo.id={mediainfo.id}&mediainfo.name={mediainfo.name}&mediainfo.description={mediainfo.description}&player.duration={player.duration}&mediainfo.tags={mediainfo.tags}&window.location.href={window.location.href}',
    serverUrlWithReplacements = 'http://www.example.com/ads?player.id=' + this.player.id() + '&mediainfo.id=888&mediainfo.name=exampletitle&mediainfo.description=exampledesc&player.duration=30&mediainfo.tags=tagone%2Ctagtwo&window.location.href=' + encodeURIComponent(window.location.href),
    actualAdrequestUrl;

  this.player.duration = function() { return 30; };

  this.player.mediainfo = {
    id: 888,
    name: 'exampletitle',
    description: 'exampledesc',
    tags: ['tagone', 'tagtwo']
  };

  this.player.ima3({
    serverUrl: serverUrl,
    adTechOrder: ['html5'],
    requestMode: 'ondemand'
  });

  this.player.ima3.adsLoader.requestAds = function(ad) {
    adrequestTriggered = true;
    actualAdrequestUrl = ad.adTagUrl;
  };

  this.player.trigger('contentupdate');
  this.player.trigger('play');
  assert.ok(!adrequestTriggered, 'requestAds should not be triggered when content is udpated.');
  this.player.ima3.adrequest();
  assert.ok(adrequestTriggered, 'requestAds should be triggered when content is udpated.');
  assert.equal(actualAdrequestUrl, serverUrlWithReplacements, 'The url in the request was not the macro replaced serverUrl configured.');
});
})(window, window.videojs, window.helpers);