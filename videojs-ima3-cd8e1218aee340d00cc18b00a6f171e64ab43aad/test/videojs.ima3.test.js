QUnit.module('IMA3 Plugin', window.sharedModuleHooks());

QUnit.test('the environment is sane', function(assert) {
  assert.expect(1);
  assert.ok(true, 'true is ok');
});

QUnit.test('is registered on load', function(assert) {
  assert.expect(1);
  assert.ok(this.player.ima3, 'IMA3 is loaded');
});

// the IMA control bar needs a unique name or it may incorrectly
// overwrite player.controlBar
QUnit.test('provides a name to the ad control bar', function(assert) {
  assert.expect(1);
  this.player.ima3();
  assert.strictEqual(this.player.ima3.settings.adControlBar.name, 'adControlBar', 'sets the ad control bar name');
});

QUnit.test('"ima3-loading-spinner" not present by default', function(assert) {
  assert.expect(2);
  var el = this.player.el();
  this.player.ima3();
  assert.notOk(this.player.ima3.settings.loadingSpinner, '`loadingSpinner` default value is `false`');
  assert.notOk(window.helpers.hasClass(el, 'ima3-loading-spinner'), '"ima3-loading-spinner" should NOT be in "' + el.className + '"');
});

QUnit.test('adds the "ima3-loading-spinner" class when config `loadingSpinner` is `true`', function(assert) {
  assert.expect(1);
  var el = this.player.el();

  this.player.ima3({
    loadingSpinner: true
  });

  assert.ok(window.helpers.hasClass(el, 'ima3-loading-spinner'), '"ima3-loading-spinner" should be in "' + el.className + '"');
});

QUnit.test('initial ready state is false', function(assert) {
  assert.expect(1);
  this.player.ima3();
  assert.notOk(this.player.ima3.isReady_);
});

QUnit.test('ima3-ready sets the internal ready state', function(assert) {
  assert.expect(4);
  var readySpy = sinon.spy();
  this.player.ima3();
  this.player.on('ima3-ready', readySpy);
  assert.notOk(this.player.ima3.isReady_, 'The internal ready state should be `false` on init');
  assert.strictEqual(readySpy.callCount, 0, '"ima3-ready" should NOT be fired');
  this.player.trigger('ima3-ready');
  assert.ok(this.player.ima3.isReady_, 'The internal ready state should be `true`');
  assert.strictEqual(readySpy.callCount, 1, '"ima3-ready" should be fired');
});

QUnit.test('callbacks to `ima3.ready()` will only be called when the "ima3-ready" event is fired', function(assert) {
  assert.expect(2);
  var readySpy = sinon.spy();
  this.player.ima3();
  this.player.ima3.ready(readySpy);
  assert.strictEqual(readySpy.callCount, 0, 'callbacks should not be invoked until "ima3-ready" event is fired');
  this.player.trigger('ima3-ready');
  assert.strictEqual(readySpy.callCount, 1, 'callbacks should be invoked when "ima3-ready" event is fired');
});

QUnit.test('callbacks to `ima3.ready()` which are added after "ima3-ready" will be fired immediately', function(assert) {
  assert.expect(1);
  var readySpy = sinon.spy();
  this.player.ima3();
  this.player.trigger('ima3-ready');
  this.player.ima3.ready(readySpy);
  assert.strictEqual(readySpy.callCount, 1, 'callbacks should be invoked if "ima3-ready" event was already fired');
});

QUnit.test('callbacks to `ima3.ready()` will be invoked in the order they were setup', function(assert) {
  assert.expect(3);
  var readySpyA = sinon.spy();
  var readySpyB = sinon.spy();
  this.player.ima3();
  this.player.ima3.ready(readySpyA);

  this.player.ima3.ready(function(){
    assert.strictEqual(readySpyA.callCount, 1, 'readySpyA should have been called before this point');
    readySpyB.apply(this, arguments);
  });

  this.player.trigger('ima3-ready');
  assert.strictEqual(readySpyA.callCount, 1, 'readySpyA should have been called');
  assert.strictEqual(readySpyB.callCount, 1, 'readySpyB should have been called');
});

QUnit.test('there is a version property', function(assert) {
  assert.expect(1);
  this.player.ima3();
  assert.strictEqual(this.player.ima3.version, '{{ VERSION }}', 'there should be a version property.');
});

QUnit.test('prevents the content from playing during ads', function(assert) {
  assert.expect(1);
  var PLAY_ATTEMPTS = Math.round(Math.random() * 19) + 1;
  var i = PLAY_ATTEMPTS;
  this.player.ima3();
  sinon.spy(this.player, 'pause');

  // enter ad playback mode
  this.player.trigger('adsready');
  this.player.trigger('play');
  this.player.ads.startLinearAdMode();

  // since the video source hasn't changed, we assume a separate
  // display is being used for ad playback. Trigger an unpredictable
  // number of play attempts to be sure that we prevent playback for
  // each one.
  while (i--) {
    this.player.trigger('adplay');
  }

  // let the asynchronous pauses take effect
  this.clock.tick(1);

  // there should be one pause for startLinearAdMode and one for each
  // play attempt
  assert.strictEqual(this.player.pause.callCount, PLAY_ATTEMPTS + 1, 'paused each play attempt');
});

QUnit.test('hides the ad-control bar when the native controls are in use', function(assert) {
  assert.expect(4);

  var getDisplay = function() {
    return window.helpers.getComputedStyle(document.querySelector('.vjs-ad-control-bar'))('display');
  };

  this.player.ima3();
  this.player.pause = function(){};

  // enter ad playback mode
  this.player.trigger('adsready');
  this.player.trigger('play');
  this.player.ads.startLinearAdMode();

  // first what svt does -- controls should be visible by default
  this.player.usingNativeControls(false);
  this.player.controls(true);
  assert.notStrictEqual(getDisplay(), 'none', 'Ad Controls should be visible by default.');

  // no controls even if native true when controls are false
  this.player.usingNativeControls(true);
  this.player.controls(false);
  assert.strictEqual(getDisplay(), 'none', 'Ad Controls should be hidden if main controls are.');

  // the android native control use case
  this.player.usingNativeControls(true);
  this.player.controls(true);
  assert.strictEqual(getDisplay(), 'none', 'Ad Controls should be hidden if native controls are in use too.');

  // no controls if both false
  this.player.usingNativeControls(false);
  this.player.controls(false);
  assert.strictEqual(getDisplay(), 'none', 'Ad Controls should be hidden when both native and main controls are false.');
});

QUnit.test('ad macro tags are replaced in server url', function(assert) {
  var serverUrl = 'http://www.example.com/ads?player.id={player.id}&mediainfo.id={mediainfo.id}&mediainfo.name={mediainfo.name}&mediainfo.description={mediainfo.description}&player.duration={player.duration}&mediainfo.tags={mediainfo.tags}&window.location.href={window.location.href}',
      serverUrlWithReplacements = 'http://www.example.com/ads?player.id=' + this.player.id() + '&mediainfo.id=888&mediainfo.name=exampletitle&mediainfo.description=exampledesc&player.duration=30&mediainfo.tags=tagone%2Ctagtwo&window.location.href=' + encodeURIComponent(window.location.href),
      serverUrlWithRandomAndTimestamp = 'http://www.example.com/ads?timestamp={timestamp}&random={random}';

  this.player.duration = function() { return 30; };

  this.player.mediainfo = {
    id: 888,
    name: 'exampletitle',
    description: 'exampledesc',
    tags: ['tagone', 'tagtwo']
  };

  this.player.ima3();

  serverUrl = this.player.ima3.adMacroReplacement(serverUrl);
  serverUrlWithRandomAndTimestamp = this.player.ima3.adMacroReplacement(serverUrlWithRandomAndTimestamp);

  assert.equal(serverUrl, serverUrlWithReplacements, 'ad server url macros not correctly replaced');
  assert.equal(serverUrlWithRandomAndTimestamp.indexOf('{'), -1, 'ad server did not replace timestamp and/or random');
});

QUnit.test('live ondemand ad gets called when id3 TXXX adcue frame is parsed', function(assert) {
  var
    id3Data = {
      value: {
        key: 'TXXX',
        data: '{"name":"adCue","time":30.0,"type":"event","parameters":{"duration":"30","customKey":"test"}}'
      },
      startTime: 1,
      endTime: 2
    },
    tt = {
      player: this.player,
      kind: 'metadata',
      mode: 'hidden',
      id: '1',
      startTime: 1,
      endTime: 2,
      addEventListener: function(event, cb) {
        if (event === 'cuechange') {
          cb.apply(this, [this]);
        }
      },
      activeCues: [id3Data]
    },
    adrequestcall,
    adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=%2F6062%2Fiab_vast_samples&ciu_szs=300x250%2C728x90&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]&cust_params=iab_vast_samples%3Dlinear',
    newadTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=%2F6062%2Fiab_vast_samples&ciu_szs=300x250%2C728x90&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]&cust_params=iab_vast_samples%3Dlinear&breaklength=30',
    keys = 'breaklength=30';

  this.player.textTracks = function() {
    return {
      length: 1,
      0: tt
    };
  };

  this.player.ima3({
    requestMode: 'oncue'
  });

  this.player.ima3.adrequest = this.player.ima3.makeAdRequestFunction(function(ad) {
    adrequestcall = {
      adTag: ad
    };
  });

  this.player.trigger('loadstart');

  assert.ok(adrequestcall, 'an adrequest event should have been triggered on the player');
  assert.ok(adrequestcall.adTag, 'the adrequest should have an adTag with it');
  assert.equal(adrequestcall.adTag, newadTagUrl, "The adTag in the adrequest event should match the new modified url in the call to adrequest method");
});
