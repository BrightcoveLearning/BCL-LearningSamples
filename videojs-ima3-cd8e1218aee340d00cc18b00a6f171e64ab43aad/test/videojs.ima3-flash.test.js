(function(window, videojs, helpers) {

// Enough ms to trigger both the polling interval and the .ready callback(s).
var READY_MS = 51;

/**
 * Get the event type string for an event forwarded from the SWF.
 *
 * @param  {sinon.spy} spy
 * @param  {String}    prop
 * @param  {Number}    [call=0]
 * @return {String}
 */
 
var fwdEventProp = function(spy, prop, call) {
  return spy.getCall(call || 0).args[0][prop];
};

QUnit.module('IMA3 Flash Plugin', window.sharedModuleHooks({
  beforeEach: function() {  
    //mock out the ad info object
    this.player.ads.ad = {}; 
    //mock out the ad pod info object
    this.player.ads.pod = {};
    // Mock out the methods that delegate to flash
    this.player.currentSrc = function() {
      return 'movie.mp4';
    };  
  }
}));

QUnit.test('registers itself on load', function(assert) {
  assert.expect(1);

  this.player.ima3({
    adTechOrder: ['flash']
  });

  assert.ok(this.player.ima3.el, 'the flash integration is loaded');
});

QUnit.test('constructs the ad swf properly in page', function(assert) {
  assert.expect(4);
  var playerEl = this.player.el();
  var ima3El, objectEl;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  // The element is positioned relative with the in-page embed
  playerEl.style.position = 'relative';
  ima3El = this.player.ima3.el;
  objectEl = playerEl.querySelector('object[name="' + playerEl.id + '-ima3-flash"]');
  assert.ok(objectEl, 'the object element is created');
  assert.strictEqual(ima3El, objectEl, 'the object is saved as the tech element');
  assert.strictEqual(helpers.getComputedStyle(ima3El)('width'), helpers.getComputedStyle(playerEl)('width'), 'the width of the player and swf are equal');
  assert.strictEqual(helpers.getComputedStyle(ima3El)('height'), helpers.getComputedStyle(playerEl)('height'), 'the height of the player and swf are equal');
});

if (!/phantom/i.test(window.navigator.userAgent)) {
  QUnit.test('constructs the ad swf properly in iframe', function(assert) {
    assert.expect(4);
    var playerEl = this.player.el();
    var ima3El, objectEl;

    this.player.ima3({
      adTechOrder: ['flash']
    });

    // The element is positioned absolutely with the iframe embed
    playerEl.style.position = 'absolute';
    ima3El = this.player.ima3.el;
    objectEl = playerEl.querySelector('object[name="' + playerEl.id + '-ima3-flash"]');
    assert.ok(objectEl, 'the object element is created');
    assert.strictEqual(ima3El, objectEl, 'the object is saved as the tech element');
    assert.strictEqual(helpers.getComputedStyle(ima3El)('width'), helpers.getComputedStyle(playerEl)('width'), 'the width of the player and swf are equal');
    assert.strictEqual(helpers.getComputedStyle(ima3El)('height'), helpers.getComputedStyle(playerEl)('height'), 'the height of the player and swf are equal');
  });
}

QUnit.test('does not send ima3 ready until the swf is ready', function(assert) {
  assert.expect(4);
  var ima3readySpy = sinon.spy();
  this.player.on('ima3-ready', ima3readySpy);

  this.player.ima3({
    adTechOrder: ['flash']
  });

  // Tick enough for the interval to fire once.
  this.clock.tick(READY_MS);

  assert.notOk(this.player.ima3.isReady_, 'The internal state for ima3ready should be false');
  assert.strictEqual(ima3readySpy.callCount, 0, 'ima3ready should not fire until the swf has loaded.');

  // once vjs_trigger exists, the swf is considered ready
  this.player.ima3.el.vjs_trigger = function(){};

  // Tick enough for the interval to fire a second time.
  this.clock.tick(READY_MS);

  assert.ok(this.player.ima3.isReady_, 'The internal state for ima3ready should be true');
  assert.strictEqual(ima3readySpy.callCount, 1, 'ima3ready should fire as soon as the swf has loaded.');
});

QUnit.test('sends "contentupdate" to flash when the swf is loaded and the src is already set', function(assert) {
  assert.expect(2);
  var flashContentUpdateSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  assert.strictEqual(flashContentUpdateSpy.callCount, 0, '"contentupdate" was not triggered early');

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'contentupdate') {
      flashContentUpdateSpy.apply(this, arguments);
    }
  };

  this.clock.tick(READY_MS);
  assert.strictEqual(flashContentUpdateSpy.callCount, 1, '"contentupdate" was not sent to flash when the swf was ready with a src');
});

QUnit.test('"contentupdate" is NOT triggered on the player when the swf is loaded and the src is already set', function(assert) {
  assert.expect(2);
  var playerContentUpdateSpy = sinon.spy();
  this.player.on('contentupdate', playerContentUpdateSpy);

  this.player.ima3({
    adTechOrder: ['flash']
  });

  assert.strictEqual(playerContentUpdateSpy.callCount, 0, '"contentupdate" was triggered before interval and should not have been');
  this.clock.tick(READY_MS);
  assert.strictEqual(playerContentUpdateSpy.callCount, 0, '"contentupdate" was triggered after interval and should not have been');
});

QUnit.test('"contentupdate" is triggered on the player and sent to flash on load if the src is already set and then to flash again when the src is changed', function(assert) {
  assert.expect(6);
  var playerContentUpdateSpy = sinon.spy();
  var flashContentUpdateSpy = sinon.spy();
  this.player.on('contentupdate', playerContentUpdateSpy);

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'contentupdate') {
      flashContentUpdateSpy.apply(this, arguments);
    }
  };

  assert.strictEqual(flashContentUpdateSpy.callCount, 0, '"contentupdate" was not triggered before interval');
  assert.strictEqual(playerContentUpdateSpy.callCount, 0, '"contentupdate" was triggered before interval and should not have been');
  this.clock.tick(READY_MS);
  assert.strictEqual(flashContentUpdateSpy.callCount, 1, '"contentupdate" should be sent to flash if there is a src set on load');
  assert.strictEqual(playerContentUpdateSpy.callCount, 0, '"contentupdate" was triggered after interval and should not have been');

  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.trigger('loadstart');
  assert.strictEqual(playerContentUpdateSpy.callCount, 1, '"contentupdate" was triggered after interval and should not have been');
  assert.strictEqual(flashContentUpdateSpy.callCount, 2, '"contentupdate" should be sent to flash after the src is set');
});

QUnit.test('does not send "contentupdate" to flash when the swf is loaded and there is no src', function(assert) {
  assert.expect(2);
  var flashContentUpdateSpy = sinon.spy();

  this.player.currentSrc = function() {
    return;
  };

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'contentupdate') {
      flashContentUpdateSpy.apply(this, arguments);
    }
  };

  assert.strictEqual(flashContentUpdateSpy.callCount, 0, '"contentupdate" was not triggered early');
  this.clock.tick(READY_MS);
  assert.strictEqual(flashContentUpdateSpy.callCount, 0, '"contentupdate" was not triggered when the swf was ready');
});

QUnit.test('"contentupdate" is triggered on the player when the swf is loaded without a src and then set', function(assert) {
  assert.expect(4);
  var playerContentUpdateSpy = sinon.spy();
  var flashContentUpdateSpy = sinon.spy();

  this.player.currentSrc = function() {
    return;
  };

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.on('contentupdate', playerContentUpdateSpy);

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'contentupdate') {
      flashContentUpdateSpy();
    }
  };

  assert.strictEqual(playerContentUpdateSpy.callCount, 0, '"contentupdate" was triggered before interval and should not have been');
  assert.strictEqual(flashContentUpdateSpy.callCount, 0, '"contentupdate" was sent to flash before a src was set');
  this.clock.tick(READY_MS);

  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.trigger('loadstart');
  assert.strictEqual(playerContentUpdateSpy.callCount, 1, '"contentupdate" should be triggered after the src is set');
  assert.strictEqual(flashContentUpdateSpy.callCount, 1, '"contentupdate" should be sent to flash after the src is set');
});

QUnit.test('sends ad events to the swf', function(assert) {
  assert.expect(7);
  var triggerSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  // Having an initial currentSrc will cause a "contentupdate" event we don't want.
  this.player.currentSrc = function() {
    return;
  };

  this.player.ima3.el.vjs_trigger = triggerSpy;
  this.clock.tick(READY_MS);
  this.player.trigger('readyforpreroll');
  assert.strictEqual(triggerSpy.callCount, 1, 'an event is triggered');
  assert.strictEqual(fwdEventProp(triggerSpy, 'type'), 'readyforpreroll', '"readyforpreroll" is triggered');

  this.player.ads.state = 'content-playback';
  this.player.trigger('ended');
  assert.strictEqual(triggerSpy.callCount, 2, 'an event is triggered');
  assert.strictEqual(fwdEventProp(triggerSpy, 'type', 1), 'ended', '"ended" is triggered');

  this.player.trigger('contentupdate');
  assert.strictEqual(triggerSpy.callCount, 2, 'an event is not triggered if the src hasn\'t changed');

  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.trigger('contentupdate');
  assert.strictEqual(triggerSpy.callCount, 3, 'an event is triggered');
  assert.strictEqual(fwdEventProp(triggerSpy, 'type', 2), 'contentupdate', '"contentupdate" is triggered');
});

QUnit.test('sends timeupdates to the swf', function(assert) {
  assert.expect(3);
  var triggerSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  // Having an initial currentSrc will cause a "contentupdate" event we don't want.
  this.player.currentSrc = function() {
    return;
  };

  this.player.currentTime = function() {
    return 11;
  };

  this.player.ima3.el.vjs_trigger = triggerSpy;
  this.clock.tick(READY_MS);
  this.player.trigger('timeupdate');
  assert.strictEqual(triggerSpy.callCount, 1, 'an event is triggered');
  assert.strictEqual(fwdEventProp(triggerSpy, 'type'), 'timeupdate', '"timeupdate" is triggered');
  assert.strictEqual(fwdEventProp(triggerSpy, 'currentTime'), 11, 'the `currentTime` is included');
});

QUnit.test('waits until the swf loads to begin forwarding events', function(assert) {
  assert.expect(1);
  var triggerSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  // Having an initial currentSrc will cause a "contentupdate" event we don't want.
  this.player.currentSrc = function() {
    return;
  };

  this.player.ima3.el.vjs_trigger = triggerSpy;

  this.player.trigger('timeupdate');
  assert.strictEqual(triggerSpy.callCount, 0, 'no event was triggered');
});

QUnit.test('adds the protocol to the ad server url', function(assert) {
  assert.expect(1);
  var triggerSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash'],
    serverUrl: '//missing/the/protocol'
  });

  this.player.ima3.el.vjs_trigger = triggerSpy;
  this.clock.tick(READY_MS);

  assert.strictEqual(
    fwdEventProp(triggerSpy, 'options').serverUrl,
    window.location.protocol + '//missing/the/protocol',
    'the protocol was added'
  );
});

QUnit.test('creates custom controls for ad playback', function(assert) {
  assert.expect(3);
  this.player.ima3({
    adTechOrder: ['flash']
  });

  assert.ok(this.player.ima3.adPlayer, 'the ad player is created');
  assert.ok(this.player.ima3.adControlBar, 'the ad control bar is created');
  assert.strictEqual(
    this.player.ima3.adControlBar.el(),
    this.player.el().querySelector('.vjs-ad-control-bar'),
    'ad controls are added to the player DOM'
  );
});

/*
 * If the flash ad container is not on screen it can/will be throttled.
 * See PLAY-869 and PLAY-882 for evidence of why this is important.
 */
QUnit.test('verify left=0 in style', function(assert) {
  assert.expect(2);
  var param;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  param = this.player.el().querySelector('.vjs-ima3-flash-ad-container');
  assert.ok(param, 'flash ad container is created');
  assert.notOk(param.style.left, 'flash ad container should be intialized onscreen.  MUST FIX.  If flash is not on-screen on load, the flash player will be throttled');
});

QUnit.test('triggers events when the volume changes', function(assert) {
  assert.expect(4);
  var adPlayer, volumeChangeSpy;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  adPlayer = this.player.ima3.adPlayer;
  volumeChangeSpy = sinon.spy();

  adPlayer.on('volumechange', volumeChangeSpy);

  assert.notOk(adPlayer.muted(), 'the player does not start muted');
  assert.strictEqual(volumeChangeSpy.callCount, 0, 'the getter does not fire events');

  adPlayer.muted(true);
  assert.strictEqual(volumeChangeSpy.callCount, 1, '"volumechange" was fired on mute');

  adPlayer.volume(0.5);
  assert.strictEqual(volumeChangeSpy.callCount, 2, '"volumechange" was fired');
});

QUnit.test('uses the content control bar options for the ad control bar', function(assert) {
  assert.expect(2);

  // Kill the preconstructed player and build a new one with different options.
  this.player.dispose();
  this.video = document.createElement('video');
  this.video.load = function() {};
  document.getElementById('qunit-fixture').appendChild(this.video);

  this.player = videojs(this.video, {
    children: {
      controlBar: {
        children: {
          muteToggle: false
        }
      }
    }
  });

  this.player.ima3({
    adTechOrder: ['flash']
  });

  assert.strictEqual(
    this.player.ima3.settings.adControlBar.children.muteToggle,
    false,
    'the option is defaulted'
  );

  assert.notOk(
    this.player.ima3.adControlBar.options_.children.muteToggle,
    'the options are used to init the control bar'
  );
});

QUnit.test('updates the current time during ad playback', function(assert) {
  assert.expect(8);
  var UPDATE_INTERVAL = 250;
  var DURATION = 1000;
  var adPlayer, timeUpdateSpy;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  adPlayer = this.player.ima3.adPlayer;
  timeUpdateSpy = sinon.spy();

  adPlayer.on('timeupdate', timeUpdateSpy);

  this.player.ima3.el.vjs_duration = function() {
    return DURATION;
  };

  this.clock.tick(READY_MS);
  assert.strictEqual(adPlayer.currentTime(), 0, 'current time starts at zero');

  adPlayer.trigger('play');
  assert.strictEqual(timeUpdateSpy.callCount, 0, '"timeupdate" should not be triggered by play');

  this.clock.tick(UPDATE_INTERVAL);
  assert.strictEqual(timeUpdateSpy.callCount, 1, '"timeupdate" was triggered');
  assert.strictEqual(adPlayer.currentTime(), 0.25, 'current time was updated');

  this.clock.tick(UPDATE_INTERVAL);
  assert.strictEqual(timeUpdateSpy.callCount, 2, '"timeupdate" is triggered again');
  assert.strictEqual(adPlayer.currentTime(), 0.5, 'current time is updated again');

  this.clock.tick(UPDATE_INTERVAL);
  assert.strictEqual(timeUpdateSpy.callCount, 3, '"timeupdate" is triggered again');
  assert.strictEqual(adPlayer.currentTime(), 0.75, 'current time is updated again');
});

QUnit.test('new ads should restart the current time', function(assert) {
  assert.expect(3);
  var UPDATE_INTERVAL = 250;
  var DURATION = 1000;
  var adPlayer;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_duration = function() {
    return DURATION;
  };

  adPlayer = this.player.ima3.adPlayer;
  this.clock.tick(READY_MS);

  adPlayer.trigger('play');
  this.clock.tick(UPDATE_INTERVAL);
  assert.strictEqual(adPlayer.currentTime(), 0.25, 'the first ad is playing');

  adPlayer.trigger('ima3-started');
  assert.strictEqual(adPlayer.currentTime(), 0, 'current time is reset for the new ad');

  this.clock.tick(UPDATE_INTERVAL);
  assert.strictEqual(adPlayer.currentTime(), 0.25, 'the second ad is playing');
});

QUnit.test('caches duration in javascript', function(assert) {
  assert.expect(7);
  var duration = 100;
  var durationSpy = sinon.spy();
  var adPlayer;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_duration = function() {
    durationSpy.apply(this, arguments);
    return duration;
  };

  adPlayer = this.player.ima3.adPlayer;

  assert.strictEqual(adPlayer.duration(), duration, 'the duration is reported');
  assert.strictEqual(durationSpy.callCount, 1, 'one call is proxied');

  adPlayer.duration();
  assert.strictEqual(durationSpy.callCount, 1, 'subsequent calls are returned from the cache');

  duration++;
  adPlayer.trigger('durationchange');
  assert.strictEqual(adPlayer.duration(), duration, 'duration changes update the cache');
  assert.strictEqual(durationSpy.callCount, 2, '"durationchange" calls the swf');

  duration++;
  adPlayer.trigger('ima3-started');
  assert.strictEqual(adPlayer.duration(), duration, 'new ads update the cache');
  assert.strictEqual(durationSpy.callCount, 3, 'new ads call the swf for duration');
});

QUnit.test('allowsscriptaccess from the ad swf', function(assert) {
  assert.expect(2);
  var param;

  this.player.ima3({
    adTechOrder: ['flash']
  });

  param = this.player.ima3.el.querySelector('param[name="AllowScriptAccess"]');
  assert.ok(param, 'the script access param is present');
  assert.strictEqual(param.value, 'always', 'script access is enabled');
});

QUnit.test('accepts overrides to the ima swf location', function(assert) {
  assert.expect(1);
  var swfLocation;

  this.player.ima3({
    adTechOrder: ['flash'],
    adSwf: 'http://example.com/custom.swf'
  });

  swfLocation = this.player.ima3.el.data ||
    // IE...
    this.player.ima3.el.querySelector('param[name="movie"]').value;

  assert.strictEqual(swfLocation, 'http://example.com/custom.swf', 'swf location is customized');
});

QUnit.test('passes settings to the swf with ad events', function(assert) {
  assert.expect(7);
  var triggerSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash'],
    serverUrl: 'initial-server'
  });

  this.player.ima3.el.vjs_trigger = triggerSpy;
  this.clock.tick(READY_MS);
  assert.strictEqual(triggerSpy.callCount, 1, 'forwarded "contentupdate"');
  assert.ok(fwdEventProp(triggerSpy, 'options').serverUrl.indexOf('initial-server') >= 0, 'sent serverUrl');

  this.player.ima3.settings.debug = true;
  this.player.trigger('readyforpreroll');
  assert.strictEqual(triggerSpy.callCount, 2, 'forwarded "readyforpreroll"');
  assert.ok(fwdEventProp(triggerSpy, 'options', 1).serverUrl, 'sent `serverUrl`');

  this.player.ima3.settings.serverUrl = 'some-server';
  this.player.trigger('contentupdate');
  assert.strictEqual(triggerSpy.callCount, 2, 'will not forward "contentupdate" if the src is the same');

  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.trigger('contentupdate');
  assert.strictEqual(triggerSpy.callCount, 3, 'forwarded "contentupdate"');
  assert.strictEqual(fwdEventProp(triggerSpy, 'options', 2).serverUrl, 'some-server', 'sent `serverUrl`');
});

QUnit.test('fullscreen is delegated to the content player during ads', function(assert) {
  assert.expect(2);

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.trigger({
    type: 'ima3-ads-manager-loaded',
    originalEvent: {
      getAdsManager: function() {
        return {
          init: function() {},
          start: function() {},
          resize: function() {}
        };
      }
    }
  });

  this.player.ima3.adControlBar.fullscreenToggle.trigger('click');
  assert.ok(this.player.isFullscreen(), 'entered fullscreen');
  this.player.ima3.adControlBar.fullscreenToggle.trigger('click');
  assert.notOk(this.player.isFullscreen(), 'exited fullscreen');
});

QUnit.test('"adserror" sent to contentPlayer on adserror in swf', function(assert) {
  assert.expect(1);
  var adsErrorSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.on('adserror', adsErrorSpy);
  this.player.ima3.adPlayer.trigger('adserror');
  assert.ok(adsErrorSpy.callCount, 1, '"adserror" should have been called if requested by swf');
});

QUnit.test('adrequest on demand triggers "adrequest" call to Flash tech', function(assert) {
  assert.expect(2);
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
  var adRequestSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.adrequest = this.player.ima3.makeAdRequestFunction(adRequestSpy);
  this.player.ima3.el.vjs_trigger = function() {};
  this.player.ima3.adrequest(adTagUrl);

  assert.strictEqual(adRequestSpy.callCount, 1, 'an `adrequest` call should have been made to Flash');
  assert.strictEqual(adRequestSpy.getCall(0).args[0], adTagUrl, 'The ad URL in the "adrequest" event should match the url in the call to `adrequest` method');
});

QUnit.test('adrequest on demand sent to swf', function(assert) {
  assert.expect(2);
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
  var adRequestSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'adrequest') {
      adRequestSpy.apply(this, arguments);
    }
  };

  this.clock.tick(READY_MS);
  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(adRequestSpy.callCount, 1, 'an "adrequest" event should have been triggered to the swf');
  assert.strictEqual(adRequestSpy.getCall(0).args[0].adTag, adTagUrl, "The adTag in the adrequest event should match the url in the call to adrequest method");
});

QUnit.test('adrequest on demand sent to swf even if called before swf is ready', function(assert) {
  assert.expect(3);
  var adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
  var adRequestSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'adrequest') {
      adRequestSpy.apply(this, arguments);
    }
  };

  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(adRequestSpy.callCount, 0, 'an "adrequest" event should not have been triggered to the swf yet');
  this.clock.tick(READY_MS);
  assert.strictEqual(adRequestSpy.callCount, 1, 'an "adrequest" event should have been triggered to the swf');
  assert.strictEqual(adRequestSpy.getCall(0).args[0].adTag, adTagUrl, 'The adTag in the "adrequest" event should match the url in the call to `adrequest` method');
});

QUnit.test('ondemand requests with relative paths are prefixed', function(assert) {
  assert.expect(1);
  var adTagUrl = '//pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
  var adRequestSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'adrequest') {
      adRequestSpy.apply(this, arguments);
    }
  };

  this.clock.tick(READY_MS);
  this.player.ima3.adrequest(adTagUrl);
  assert.strictEqual(adRequestSpy.getCall(0).args[0].adTag, window.location.protocol + adTagUrl, 'The adTag in the "adrequest" event should match the url in the call to `adrequest` method');
});

QUnit.test('send `debug` option to flash when `debug` is triggered', function(assert) {
  assert.expect(4);
  var playerDebugSpy = sinon.spy();
  var flashDebugSpy = sinon.spy();

  this.player.ima3({
    adTechOrder: ['flash']
  });

  this.player.on('debug', playerDebugSpy);

  this.player.ima3.el.vjs_trigger = function(event) {
    if (event.type === 'debug') {
      flashDebugSpy.apply(this, arguments);
    }
  };

  this.clock.tick(READY_MS);
  this.player.trigger('debug');
  assert.strictEqual(playerDebugSpy.callCount, 1, 'a "debug" event has been triggered');
  assert.strictEqual(flashDebugSpy.callCount, 1, 'a "debug" event should have been triggered to the swf');
  assert.strictEqual(playerDebugSpy.getCall(0).args[0].enable, undefined, 'there is no specific `enable` value on the event');

  this.player.trigger({
    type: 'debug',
    enable: true
  });

  assert.strictEqual(playerDebugSpy.getCall(1).args[0].enable, true, 'there should be an `enable` option with the event');
});

QUnit.test('adds and removes the vjs-ima3-paused class based on swf triggered events from the adPlayer', function(assert) {
  assert.expect(3);
  var adPlayer, el;

  this.player.ima3({
    adTechOrder: ['flash'],
    serverUrl: 'initial-server'
  });

  this.clock.tick(READY_MS);
  el = this.player.el();
  adPlayer = this.player.ima3.adPlayer;
  adPlayer.trigger('ima3-started');
  assert.notOk(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should not be on the vjs element when the ad starts');
  adPlayer.trigger('pause');
  assert.ok(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should be on the vjs element when the ad pauses');
  adPlayer.trigger('play');
  assert.notOk(helpers.hasClass(el, 'vjs-ima3-paused'), 'The "vjs-ima3-paused" class should not be on the vjs element when the ad resumes');
});

QUnit.test('`onplay` request-ads-mode send contetupdate event to the swf', function(assert) {
  var event = null;
  this.player.ima3({
    adTechOrder: ['flash'],
    requestMode: 'onplay'
  });

  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.ima3.el.vjs_trigger = function(e) {
    event = e;
  };

  this.clock.tick(READY_MS);

  this.player.trigger('play');
  assert.ok(event, 'an event is triggered');
  assert.equal('contentupdate', event.type, 'contentupdate is triggered');

});

QUnit.test('`ondemand` request-ads-mode should not send contetupdate event to the swf', function(assert) {
  var requestCount = 0;
  this.player.ima3({
    adTechOrder: ['flash'],
    requestMode: 'ondemand'
  });
  this.player.currentSrc = function() {
    return 'newMovie.mp4';
  };

  this.player.ima3.el.vjs_trigger = function(e) {
    if (e.type === 'adrequest') {
      requestCount++;
    }
  };
  this.clock.tick(READY_MS);
  this.player.trigger('play');
  assert.equal(requestCount, 0, 'request is not triggered');
  this.player.ima3.adrequest();
  assert.equal(requestCount, 1, 'request is triggered');
});
//Writing up a mock function to populate the ad and pod info objects
var handleEvt = function (evt) {
  
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

//Writing the additional tests for universal Flash events translated to BC Events

QUnit.test('triggers contrib ad event ads-started when ima3-started has been fired', function(assert) {
  var event;
  this.player.ima3({
    adTechOrder: ['flash']
  });  
  this.player.trigger('ima3-started');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-started']);
  assert.equal('ads-ad-started',this.player.ima3.settings.eventMap['ima3-started'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-clicked when ima3-clicked has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-click');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-click']);
  assert.equal('ads-click', this.player.ima3.settings.eventMap['ima3-click'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-firstquartile when ima3-first-quartile has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-first-quartile');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-first-quartile']);
  assert.equal('ads-first-quartile', this.player.ima3.settings.eventMap['ima3-first-quartile'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-midpoint when ima3-midpoint has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-midpoint');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-midpoint']);
  assert.equal('ads-midpoint', this.player.ima3.settings.eventMap['ima3-midpoint'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-thirdquartile when ima3-third-quartile has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-third-quartile');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-third-quartile']);
  assert.equal('ads-third-quartile', this.player.ima3.settings.eventMap['ima3-third-quartile'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-volume-changed when ima3-volume-changed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-volume-changed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-volume-changed']);
  assert.equal('ads-volumechange', this.player.ima3.settings.eventMap['ima3-volume-changed'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-paused when ima3-paused has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-paused');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-paused']);
  assert.equal('ads-pause', this.player.ima3.settings.eventMap['ima3-paused'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-resumed when ima3-resumed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-resumed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-resumed']);
  assert.equal('ads-play', this.player.ima3.settings.eventMap['ima3-resumed'], 'BC translated event matches');
});

QUnit.test('triggers contrib ad event ads-allpods-completed when ima3-all-ads-completed has been fired', function(assert) {
  this.player.ima3({
    adTechOrder: ['flash']
  });
  this.player.trigger('ima3-all-ads-completed');
  handleEvt.call(this, this.player.ima3.settings.eventMap['ima3-all-pods-completed']);
  assert.equal('ads-allpods-completed', this.player.ima3.settings.eventMap['ima3-all-ads-completed'], 'BC translated event matches');
});
})(window, window.videojs, window.helpers);