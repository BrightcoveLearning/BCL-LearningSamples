import Component from './component.js';
import * as Lib from './lib.js';
import * as Events from './events.js';
import FullscreenApi from './fullscreen-api.js';
import MediaError from './media-error.js';
import Options from './options.js';
import safeParseTuple from 'safe-json-parse/tuple';
import window from 'global/window';
import document from 'global/document';

// Include required child components
import MediaLoader from './tech/loader.js';
import Poster from './poster-image.js';
import TextTrackDisplay from './tracks/text-track-display.js';
import LoadingSpinner from './loading-spinner.js';
import BigPlayButton from './big-play-button.js';
import controlBar from './control-bar/control-bar.js';
import ErrorDisplay from './error-display.js';
import TextTrackSettings from './tracks/text-track-settings.js';
// Require html5 for disposing the original video tag
import Html5 from './tech/html5.js';

/**
 * An instance of the `Player` class is created when any of the Video.js setup methods are used to initialize a video.
 *
 * ```js
 * var myPlayer = videojs('example_video_1');
 * ```
 *
 * In the following example, the `data-setup` attribute tells the Video.js library to create a player instance when the library is ready.
 *
 * ```html
 * <video id="example_video_1" data-setup='{}' controls>
 *   <source src="my-source.mp4" type="video/mp4">
 * </video>
 * ```
 *
 * After an instance has been created it can be accessed globally using `Video('example_video_1')`.
 *
 * @class
 * @extends Component
 */
class Player extends Component {

  /**
   * player's constructor function
   *
   * @constructs
   * @method init
   * @param {Element} tag        The original video tag used for configuring options
   * @param {Object=} options    Player options
   * @param {Function=} ready    Ready callback function
   */
  constructor(tag, options, ready){
    // Make sure tag ID exists
    tag.id = tag.id || `vjs_video_${Lib.guid++}`;

    // Set Options
    // The options argument overrides options set in the video tag
    // which overrides globally set options.
    // This latter part coincides with the load order
    // (tag must exist before Player)
    options = Lib.obj.merge(Player.getTagSettings(tag), options);

    // Delay the initialization of children because we need to set up
    // player properties first, and can't use `this` before `super()`
    options.initChildren = false;

    // Same with creating the element
    options.createEl = false;

    // we don't want the player to report touch activity on itself
    // see enableTouchActivity in Component
    options.reportTouchActivity = false;

    // Run base component initializing with new options
    super(null, options, ready);


    // if the global option object was accidentally blown away by
    // someone, bail early with an informative error
    if (!this.options_ ||
        !this.options_.techOrder ||
        !this.options_.techOrder.length) {
      throw new Error('No techOrder specified. Did you overwrite ' +
                      'videojs.options instead of just changing the ' +
                      'properties you want to override?');
    }

    this.tag = tag; // Store the original tag used to set options

    // Store the tag attributes used to restore html5 element
    this.tagAttributes = tag && Lib.getElementAttributes(tag);

    // Update Current Language
    this.language_ = options['language'] || Options['language'];

    // Update Supported Languages
    this.languages_ = options['languages'] || Options['languages'];

    // Cache for video property values.
    this.cache_ = {};

    // Set poster
    this.poster_ = options['poster'] || '';

    // Set controls
    this.controls_ = !!options['controls'];
    // Original tag settings stored in options
    // now remove immediately so native controls don't flash.
    // May be turned back on by HTML5 tech if nativeControlsForTouch is true
    tag.controls = false;

    /**
    * Store the internal state of scrubbing
    * @private
    * @return {Boolean} True if the user is scrubbing
    */
    this.scrubbing_ = false;

    this.el_ = this.createEl();

    // Load plugins
    if (options['plugins']) {
      Lib.obj.each(options['plugins'], function(key, val){
        this[key](val);
      }, this);
    }

    this.initChildren();

    // Set isAudio based on whether or not an audio tag was used
    this.isAudio(tag.nodeName.toLowerCase() === 'audio');

    // Update controls className. Can't do this when the controls are initially
    // set because the element doesn't exist yet.
    if (this.controls()) {
      this.addClass('vjs-controls-enabled');
    } else {
      this.addClass('vjs-controls-disabled');
    }

    if (this.isAudio()) {
      this.addClass('vjs-audio');
    }

    if (this.flexNotSupported_()) {
      this.addClass('vjs-no-flex');
    }

    // TODO: Make this smarter. Toggle user state between touching/mousing
    // using events, since devices can have both touch and mouse events.
    // if (Lib.TOUCH_ENABLED) {
    //   this.addClass('vjs-touch-enabled');
    // }

    // Make player easily findable by ID
    Player.players[this.id_] = this;

    // When the player is first initialized, trigger activity so components
    // like the control bar show themselves if needed
    this.userActive_ = true;
    this.reportUserActivity();
    this.listenForUserActivity();
  }

  /**
   * Destroys the video player and does any necessary cleanup
   *
   *     myPlayer.dispose();
   *
   * This is especially helpful if you are dynamically adding and removing videos
   * to/from the DOM.
   */
  dispose() {
    this.trigger('dispose');
    // prevent dispose from being called twice
    this.off('dispose');

    // Kill reference to this player
    Player.players[this.id_] = null;
    if (this.tag && this.tag['player']) { this.tag['player'] = null; }
    if (this.el_ && this.el_['player']) { this.el_['player'] = null; }

    if (this.tech) { this.tech.dispose(); }

    super.dispose();
  }

  createEl() {
    let el = this.el_ = super.createEl('div');
    let tag = this.tag;

    // Remove width/height attrs from tag so CSS can make it 100% width/height
    tag.removeAttribute('width');
    tag.removeAttribute('height');

    // Copy over all the attributes from the tag, including ID and class
    // ID will now reference player box, not the video tag
    const attrs = Lib.getElementAttributes(tag);
    Lib.obj.each(attrs, function(attr) {
      // workaround so we don't totally break IE7
      // http://stackoverflow.com/questions/3653444/css-styles-not-applied-on-dynamic-elements-in-internet-explorer-7
      if (attr == 'class') {
        el.className = attrs[attr];
      } else {
        el.setAttribute(attr, attrs[attr]);
      }
    });

    // Update tag id/class for use as HTML5 playback tech
    // Might think we should do this after embedding in container so .vjs-tech class
    // doesn't flash 100% width/height, but class only applies with .video-js parent
    tag.id += '_html5_api';
    tag.className = 'vjs-tech';

    // Make player findable on elements
    tag['player'] = el['player'] = this;
    // Default state of video is paused
    this.addClass('vjs-paused');

    // Make box use width/height of tag, or rely on default implementation
    // Enforce with CSS since width/height attrs don't work on divs
    this.width(this.options_['width'], true); // (true) Skip resize listener on load
    this.height(this.options_['height'], true);

    // Lib.insertFirst seems to cause the networkState to flicker from 3 to 2, so
    // keep track of the original for later so we can know if the source originally failed
    tag.initNetworkState_ = tag.networkState;

    // Wrap video tag in div (el/box) container
    if (tag.parentNode) {
      tag.parentNode.insertBefore(el, tag);
    }
    Lib.insertFirst(tag, el); // Breaks iPhone, fixed in HTML5 setup.

    // The event listeners need to be added before the children are added
    // in the component init because the tech (loaded with mediaLoader) may
    // fire events, like loadstart, that these events need to capture.
    // Long term it might be better to expose a way to do this in component.init
    // like component.initEventListeners() that runs between el creation and
    // adding children
    this.el_ = el;
    this.on('loadstart', this.handleLoadStart);
    this.on('waiting', this.handleWaiting);
    this.on(['canplay', 'canplaythrough', 'playing', 'ended'], this.handleWaitEnd);
    this.on('seeking', this.handleSeeking);
    this.on('seeked', this.handleSeeked);
    this.on('ended', this.handleEnded);
    this.on('play', this.handlePlay);
    this.on('firstplay', this.handleFirstPlay);
    this.on('pause', this.handlePause);
    this.on('progress', this.handleProgress);
    this.on('durationchange', this.handleDurationChange);
    this.on('fullscreenchange', this.handleFullscreenChange);

    return el;
  }

  /**
   * Load the Media Playback Technology (tech)
   * Load/Create an instance of playback technology including element and API methods
   * And append playback element in player div.
   */
  loadTech(techName, source) {

    // Pause and remove current playback technology
    if (this.tech) {
      this.unloadTech();
    }

    // get rid of the HTML5 video tag as soon as we are using another tech
    if (techName !== 'Html5' && this.tag) {
      Component.getComponent('Html5').disposeMediaElement(this.tag);
      this.tag = null;
    }

    this.techName = techName;

    // Turn off API access because we're loading a new tech that might load asynchronously
    this.isReady_ = false;

    var techReady = function(){
      this.player_.triggerReady();
    };

    // Grab tech-specific options from player options and add source and parent element to use.
    var techOptions = Lib.obj.merge({ 'source': source, 'parentEl': this.el_ }, this.options_[techName.toLowerCase()]);

    if (source) {
      this.currentType_ = source.type;
      if (source.src == this.cache_.src && this.cache_.currentTime > 0) {
        techOptions['startTime'] = this.cache_.currentTime;
      }

      this.cache_.src = source.src;
    }

    // Initialize tech instance
    let techComponent = Component.getComponent(techName);
    this.tech = new techComponent(this, techOptions);

    this.tech.ready(techReady);
  }

  unloadTech() {
    this.isReady_ = false;

    this.tech.dispose();

    this.tech = false;
  }

  /**
   * Fired when the user agent begins looking for media data
   * @event loadstart
   */
  handleLoadStart() {
    // TODO: Update to use `emptied` event instead. See #1277.

    this.removeClass('vjs-ended');

    // reset the error state
    this.error(null);

    // If it's already playing we want to trigger a firstplay event now.
    // The firstplay event relies on both the play and loadstart events
    // which can happen in any order for a new source
    if (!this.paused()) {
      this.trigger('firstplay');
    } else {
      // reset the hasStarted state
      this.hasStarted(false);
    }
  }

  hasStarted(hasStarted) {
    if (hasStarted !== undefined) {
      // only update if this is a new value
      if (this.hasStarted_ !== hasStarted) {
        this.hasStarted_ = hasStarted;
        if (hasStarted) {
          this.addClass('vjs-has-started');
          // trigger the firstplay event if this newly has played
          this.trigger('firstplay');
        } else {
          this.removeClass('vjs-has-started');
        }
      }
      return this;
    }
    return !!this.hasStarted_;
  }

  /**
   * Fired whenever the media begins or resumes playback
   * @event play
   */
  handlePlay() {
    this.removeClass('vjs-ended');
    this.removeClass('vjs-paused');
    this.addClass('vjs-playing');

    // hide the poster when the user hits play
    // https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-play
    this.hasStarted(true);
  }

  /**
   * Fired whenever the media begins waiting
   * @event waiting
   */
  handleWaiting() {
    this.addClass('vjs-waiting');
  }

  /**
   * A handler for events that signal that waiting has ended
   * which is not consistent between browsers. See #1351
   * @private
   */
  handleWaitEnd() {
    this.removeClass('vjs-waiting');
  }

  /**
   * Fired whenever the player is jumping to a new time
   * @event seeking
   */
  handleSeeking() {
    this.addClass('vjs-seeking');
  }

  /**
   * Fired when the player has finished jumping to a new time
   * @event seeked
   */
  handleSeeked() {
    this.removeClass('vjs-seeking');
  }

  /**
   * Fired the first time a video is played
   *
   * Not part of the HLS spec, and we're not sure if this is the best
   * implementation yet, so use sparingly. If you don't have a reason to
   * prevent playback, use `myPlayer.one('play');` instead.
   *
   * @event firstplay
   */
  handleFirstPlay() {
    //If the first starttime attribute is specified
    //then we will start at the given offset in seconds
    if(this.options_['starttime']){
      this.currentTime(this.options_['starttime']);
    }

    this.addClass('vjs-has-started');
  }

  /**
   * Fired whenever the media has been paused
   * @event pause
   */
  handlePause() {
    this.removeClass('vjs-playing');
    this.addClass('vjs-paused');
  }

  /**
   * Fired while the user agent is downloading media data
   * @event progress
   */
  handleProgress() {
    // Add custom event for when source is finished downloading.
    if (this.bufferedPercent() == 1) {
      this.trigger('loadedalldata');
    }
  }

  /**
   * Fired when the end of the media resource is reached (currentTime == duration)
   * @event ended
   */
  handleEnded() {
    this.addClass('vjs-ended');
    if (this.options_['loop']) {
      this.currentTime(0);
      this.play();
    } else if (!this.paused()) {
      this.pause();
    }
  }

  /**
   * Fired when the duration of the media resource is first known or changed
   * @event durationchange
   */
  handleDurationChange() {
    // Allows for caching value instead of asking player each time.
    // We need to get the techGet response and check for a value so we don't
    // accidentally cause the stack to blow up.
    var duration = this.techGet('duration');
    if (duration) {
      if (duration < 0) {
        duration = Infinity;
      }
      this.duration(duration);
      // Determine if the stream is live and propagate styles down to UI.
      if (duration === Infinity) {
        this.addClass('vjs-live');
      } else {
        this.removeClass('vjs-live');
      }
    }
  }

  /**
   * Fired when the player switches in or out of fullscreen mode
   * @event fullscreenchange
   */
  handleFullscreenChange() {
    if (this.isFullscreen()) {
      this.addClass('vjs-fullscreen');
    } else {
      this.removeClass('vjs-fullscreen');
    }
  }

  /**
   * Object for cached values.
   */
  getCache() {
    return this.cache_;
  }

  // Pass values to the playback tech
  techCall(method, arg) {
    // If it's not ready yet, call method when it is
    if (this.tech && !this.tech.isReady_) {
      this.tech.ready(function(){
        this[method](arg);
      });

    // Otherwise call method now
    } else {
      try {
        this.tech[method](arg);
      } catch(e) {
        Lib.log(e);
        throw e;
      }
    }
  }

  // Get calls can't wait for the tech, and sometimes don't need to.
  techGet(method) {
    if (this.tech && this.tech.isReady_) {

      // Flash likes to die and reload when you hide or reposition it.
      // In these cases the object methods go away and we get errors.
      // When that happens we'll catch the errors and inform tech that it's not ready any more.
      try {
        return this.tech[method]();
      } catch(e) {
        // When building additional tech libs, an expected method may not be defined yet
        if (this.tech[method] === undefined) {
          Lib.log(`Video.js: ${method} method not defined for ${this.techName} playback technology.`, e);
        } else {
          // When a method isn't available on the object it throws a TypeError
          if (e.name == 'TypeError') {
            Lib.log(`Video.js: ${method} unavailable on ${this.techName} playback technology element.`, e);
            this.tech.isReady_ = false;
          } else {
            Lib.log(e);
          }
        }
        throw e;
      }
    }

    return;
  }

  /**
   * start media playback
   *
   *     myPlayer.play();
   *
   * @return {Player} self
   */
  play() {
    this.techCall('play');
    return this;
  }

  /**
   * Pause the video playback
   *
   *     myPlayer.pause();
   *
   * @return {Player} self
   */
  pause() {
    this.techCall('pause');
    return this;
  }

  /**
   * Check if the player is paused
   *
   *     var isPaused = myPlayer.paused();
   *     var isPlaying = !myPlayer.paused();
   *
   * @return {Boolean} false if the media is currently playing, or true otherwise
   */
  paused() {
    // The initial state of paused should be true (in Safari it's actually false)
    return (this.techGet('paused') === false) ? false : true;
  }

  /**
  * Returns whether or not the user is "scrubbing". Scrubbing is when the user
  * has clicked the progress bar handle and is dragging it along the progress bar.
  * @param  {Boolean} isScrubbing   True/false the user is scrubbing
  * @return {Boolean}               The scrubbing status when getting
  * @return {Object}                The player when setting
  */
  scrubbing(isScrubbing) {
    if (isScrubbing !== undefined) {
      this.scrubbing_ = !!isScrubbing;

      if (isScrubbing) {
        this.addClass('vjs-scrubbing');
      } else {
        this.removeClass('vjs-scrubbing');
      }

      return this;
    }

    return this.scrubbing_;
  }

  /**
   * Get or set the current time (in seconds)
   *
   *     // get
   *     var whereYouAt = myPlayer.currentTime();
   *
   *     // set
   *     myPlayer.currentTime(120); // 2 minutes into the video
   *
   * @param  {Number|String=} seconds The time to seek to
   * @return {Number}        The time in seconds, when not setting
   * @return {Player}    self, when the current time is set
   */
  currentTime(seconds) {
    if (seconds !== undefined) {

      this.techCall('setCurrentTime', seconds);

      return this;
    }

    // cache last currentTime and return. default to 0 seconds
    //
    // Caching the currentTime is meant to prevent a massive amount of reads on the tech's
    // currentTime when scrubbing, but may not provide much performance benefit afterall.
    // Should be tested. Also something has to read the actual current time or the cache will
    // never get updated.
    return this.cache_.currentTime = (this.techGet('currentTime') || 0);
  }

  /**
   * Get the length in time of the video in seconds
   *
   *     var lengthOfVideo = myPlayer.duration();
   *
   * **NOTE**: The video must have started loading before the duration can be
   * known, and in the case of Flash, may not be known until the video starts
   * playing.
   *
   * @return {Number} The duration of the video in seconds
   */
  duration(seconds) {
    if (seconds !== undefined) {

      // cache the last set value for optimized scrubbing (esp. Flash)
      this.cache_.duration = parseFloat(seconds);

      return this;
    }

    if (this.cache_.duration === undefined) {
      this.handleDurationChange();
    }

    return this.cache_.duration || 0;
  }

  /**
   * Calculates how much time is left.
   *
   *     var timeLeft = myPlayer.remainingTime();
   *
   * Not a native video element function, but useful
   * @return {Number} The time remaining in seconds
   */
  remainingTime() {
    return this.duration() - this.currentTime();
  }

  // http://dev.w3.org/html5/spec/video.html#dom-media-buffered
  // Buffered returns a timerange object.
  // Kind of like an array of portions of the video that have been downloaded.

  /**
   * Get a TimeRange object with the times of the video that have been downloaded
   *
   * If you just want the percent of the video that's been downloaded,
   * use bufferedPercent.
   *
   *     // Number of different ranges of time have been buffered. Usually 1.
   *     numberOfRanges = bufferedTimeRange.length,
   *
   *     // Time in seconds when the first range starts. Usually 0.
   *     firstRangeStart = bufferedTimeRange.start(0),
   *
   *     // Time in seconds when the first range ends
   *     firstRangeEnd = bufferedTimeRange.end(0),
   *
   *     // Length in seconds of the first time range
   *     firstRangeLength = firstRangeEnd - firstRangeStart;
   *
   * @return {Object} A mock TimeRange object (following HTML spec)
   */
  buffered() {
    var buffered = this.techGet('buffered');

    if (!buffered || !buffered.length) {
      buffered = Lib.createTimeRange(0,0);
    }

    return buffered;
  }

  /**
   * Get the percent (as a decimal) of the video that's been downloaded
   *
   *     var howMuchIsDownloaded = myPlayer.bufferedPercent();
   *
   * 0 means none, 1 means all.
   * (This method isn't in the HTML5 spec, but it's very convenient)
   *
   * @return {Number} A decimal between 0 and 1 representing the percent
   */
  bufferedPercent() {
    var duration = this.duration(),
        buffered = this.buffered(),
        bufferedDuration = 0,
        start, end;

    if (!duration) {
      return 0;
    }

    for (var i=0; i<buffered.length; i++){
      start = buffered.start(i);
      end   = buffered.end(i);

      // buffered end can be bigger than duration by a very small fraction
      if (end > duration) {
        end = duration;
      }

      bufferedDuration += end - start;
    }

    return bufferedDuration / duration;
  }

  /**
   * Get the ending time of the last buffered time range
   *
   * This is used in the progress bar to encapsulate all time ranges.
   * @return {Number} The end of the last buffered time range
   */
  bufferedEnd() {
    var buffered = this.buffered(),
        duration = this.duration(),
        end = buffered.end(buffered.length-1);

    if (end > duration) {
      end = duration;
    }

    return end;
  }

  /**
   * Get or set the current volume of the media
   *
   *     // get
   *     var howLoudIsIt = myPlayer.volume();
   *
   *     // set
   *     myPlayer.volume(0.5); // Set volume to half
   *
   * 0 is off (muted), 1.0 is all the way up, 0.5 is half way.
   *
   * @param  {Number} percentAsDecimal The new volume as a decimal percent
   * @return {Number}                  The current volume, when getting
   * @return {Player}              self, when setting
   */
  volume(percentAsDecimal) {
    let vol;

    if (percentAsDecimal !== undefined) {
      vol = Math.max(0, Math.min(1, parseFloat(percentAsDecimal))); // Force value to between 0 and 1
      this.cache_.volume = vol;
      this.techCall('setVolume', vol);
      Lib.setLocalStorage('volume', vol);
      return this;
    }

    // Default to 1 when returning current volume.
    vol = parseFloat(this.techGet('volume'));
    return (isNaN(vol)) ? 1 : vol;
  }


  /**
   * Get the current muted state, or turn mute on or off
   *
   *     // get
   *     var isVolumeMuted = myPlayer.muted();
   *
   *     // set
   *     myPlayer.muted(true); // mute the volume
   *
   * @param  {Boolean=} muted True to mute, false to unmute
   * @return {Boolean} True if mute is on, false if not, when getting
   * @return {Player} self, when setting mute
   */
  muted(muted) {
    if (muted !== undefined) {
      this.techCall('setMuted', muted);
      return this;
    }
    return this.techGet('muted') || false; // Default to false
  }

  // Check if current tech can support native fullscreen
  // (e.g. with built in controls like iOS, so not our flash swf)
  supportsFullScreen() {
    return this.techGet('supportsFullScreen') || false;
  }

  /**
   * Check if the player is in fullscreen mode
   *
   *     // get
   *     var fullscreenOrNot = myPlayer.isFullscreen();
   *
   *     // set
   *     myPlayer.isFullscreen(true); // tell the player it's in fullscreen
   *
   * NOTE: As of the latest HTML5 spec, isFullscreen is no longer an official
   * property and instead document.fullscreenElement is used. But isFullscreen is
   * still a valuable property for internal player workings.
   *
   * @param  {Boolean=} isFS Update the player's fullscreen state
   * @return {Boolean} true if fullscreen, false if not
   * @return {Player} self, when setting
   */
  isFullscreen(isFS) {
    if (isFS !== undefined) {
      this.isFullscreen_ = !!isFS;
      return this;
    }
    return !!this.isFullscreen_;
  }

  /**
   * Old naming for isFullscreen()
   * @deprecated for lowercase 's' version
   */
  isFullScreen(isFS) {
    Lib.log.warn('player.isFullScreen() has been deprecated, use player.isFullscreen() with a lowercase "s")');
    return this.isFullscreen(isFS);
  }

  /**
   * Increase the size of the video to full screen
   *
   *     myPlayer.requestFullscreen();
   *
   * In some browsers, full screen is not supported natively, so it enters
   * "full window mode", where the video fills the browser window.
   * In browsers and devices that support native full screen, sometimes the
   * browser's default controls will be shown, and not the Video.js custom skin.
   * This includes most mobile devices (iOS, Android) and older versions of
   * Safari.
   *
   * @return {Player} self
   */
  requestFullscreen() {
    var fsApi = FullscreenApi;

    this.isFullscreen(true);

    if (fsApi) {
      // the browser supports going fullscreen at the element level so we can
      // take the controls fullscreen as well as the video

      // Trigger fullscreenchange event after change
      // We have to specifically add this each time, and remove
      // when canceling fullscreen. Otherwise if there's multiple
      // players on a page, they would all be reacting to the same fullscreen
      // events
      Events.on(document, fsApi['fullscreenchange'], Lib.bind(this, function documentFullscreenChange(e){
        this.isFullscreen(document[fsApi.fullscreenElement]);

        // If cancelling fullscreen, remove event listener.
        if (this.isFullscreen() === false) {
          Events.off(document, fsApi['fullscreenchange'], documentFullscreenChange);
        }

        this.trigger('fullscreenchange');
      }));

      this.el_[fsApi.requestFullscreen]();

    } else if (this.tech.supportsFullScreen()) {
      // we can't take the video.js controls fullscreen but we can go fullscreen
      // with native controls
      this.techCall('enterFullScreen');
    } else {
      // fullscreen isn't supported so we'll just stretch the video element to
      // fill the viewport
      this.enterFullWindow();
      this.trigger('fullscreenchange');
    }

    return this;
  }

  /**
   * Old naming for requestFullscreen
   * @deprecated for lower case 's' version
   */
  requestFullScreen() {
    Lib.log.warn('player.requestFullScreen() has been deprecated, use player.requestFullscreen() with a lowercase "s")');
    return this.requestFullscreen();
  }

  /**
   * Return the video to its normal size after having been in full screen mode
   *
   *     myPlayer.exitFullscreen();
   *
   * @return {Player} self
   */
  exitFullscreen() {
    var fsApi = FullscreenApi;
    this.isFullscreen(false);

    // Check for browser element fullscreen support
    if (fsApi) {
      document[fsApi.exitFullscreen]();
    } else if (this.tech.supportsFullScreen()) {
     this.techCall('exitFullScreen');
    } else {
     this.exitFullWindow();
     this.trigger('fullscreenchange');
    }

    return this;
  }

  /**
   * Old naming for exitFullscreen
   * @deprecated for exitFullscreen
   */
  cancelFullScreen() {
    Lib.log.warn('player.cancelFullScreen() has been deprecated, use player.exitFullscreen()');
    return this.exitFullscreen();
  }

  // When fullscreen isn't supported we can stretch the video container to as wide as the browser will let us.
  enterFullWindow() {
    this.isFullWindow = true;

    // Storing original doc overflow value to return to when fullscreen is off
    this.docOrigOverflow = document.documentElement.style.overflow;

    // Add listener for esc key to exit fullscreen
    Events.on(document, 'keydown', Lib.bind(this, this.fullWindowOnEscKey));

    // Hide any scroll bars
    document.documentElement.style.overflow = 'hidden';

    // Apply fullscreen styles
    Lib.addClass(document.body, 'vjs-full-window');

    this.trigger('enterFullWindow');
  }

  fullWindowOnEscKey(event) {
    if (event.keyCode === 27) {
      if (this.isFullscreen() === true) {
        this.exitFullscreen();
      } else {
        this.exitFullWindow();
      }
    }
  }

  exitFullWindow() {
    this.isFullWindow = false;
    Events.off(document, 'keydown', this.fullWindowOnEscKey);

    // Unhide scroll bars.
    document.documentElement.style.overflow = this.docOrigOverflow;

    // Remove fullscreen styles
    Lib.removeClass(document.body, 'vjs-full-window');

    // Resize the box, controller, and poster to original sizes
    // this.positionAll();
    this.trigger('exitFullWindow');
  }

  selectSource(sources) {
    // Loop through each playback technology in the options order
    for (var i=0,j=this.options_['techOrder'];i<j.length;i++) {
      let techName = Lib.capitalize(j[i]);
      let tech = Component.getComponent(techName);

      // Check if the current tech is defined before continuing
      if (!tech) {
        Lib.log.error(`The "${techName}" tech is undefined. Skipped browser support check for that tech.`);
        continue;
      }

      // Check if the browser supports this technology
      if (tech.isSupported()) {
        // Loop through each source object
        for (var a=0,b=sources;a<b.length;a++) {
          var source = b[a];

          // Check if source can be played with this technology
          if (tech['canPlaySource'](source)) {
            return { source: source, tech: techName };
          }
        }
      }
    }

    return false;
  }

  /**
   * The source function updates the video source
   *
   * There are three types of variables you can pass as the argument.
   *
   * **URL String**: A URL to the the video file. Use this method if you are sure
   * the current playback technology (HTML5/Flash) can support the source you
   * provide. Currently only MP4 files can be used in both HTML5 and Flash.
   *
   *     myPlayer.src("http://www.example.com/path/to/video.mp4");
   *
   * **Source Object (or element):** A javascript object containing information
   * about the source file. Use this method if you want the player to determine if
   * it can support the file using the type information.
   *
   *     myPlayer.src({ type: "video/mp4", src: "http://www.example.com/path/to/video.mp4" });
   *
   * **Array of Source Objects:** To provide multiple versions of the source so
   * that it can be played using HTML5 across browsers you can use an array of
   * source objects. Video.js will detect which version is supported and load that
   * file.
   *
   *     myPlayer.src([
   *       { type: "video/mp4", src: "http://www.example.com/path/to/video.mp4" },
   *       { type: "video/webm", src: "http://www.example.com/path/to/video.webm" },
   *       { type: "video/ogg", src: "http://www.example.com/path/to/video.ogv" }
   *     ]);
   *
   * @param  {String|Object|Array=} source The source URL, object, or array of sources
   * @return {String} The current video source when getting
   * @return {String} The player when setting
   */
  src(source=this.techGet('src')) {
    let currentTech = Component.getComponent(this.techName);

    // case: Array of source objects to choose from and pick the best to play
    if (Lib.obj.isArray(source)) {
      this.sourceList_(source);

    // case: URL String (http://myvideo...)
    } else if (typeof source === 'string') {
      // create a source object from the string
      this.src({ src: source });

    // case: Source object { src: '', type: '' ... }
    } else if (source instanceof Object) {
      // check if the source has a type and the loaded tech cannot play the source
      // if there's no type we'll just try the current tech
      if (source.type && !currentTech['canPlaySource'](source)) {
        // create a source list with the current source and send through
        // the tech loop to check for a compatible technology
        this.sourceList_([source]);
      } else {
        this.cache_.src = source.src;
        this.currentType_ = source.type || '';

        // wait until the tech is ready to set the source
        this.ready(function(){

          // The setSource tech method was added with source handlers
          // so older techs won't support it
          // We need to check the direct prototype for the case where subclasses
          // of the tech do not support source handlers
          if (currentTech.prototype.hasOwnProperty('setSource')) {
            this.techCall('setSource', source);
          } else {
            this.techCall('src', source.src);
          }

          if (this.options_['preload'] == 'auto') {
            this.load();
          }

          if (this.options_['autoplay']) {
            this.play();
          }
        });
      }
    }

    return this;
  }

  /**
   * Handle an array of source objects
   * @param  {[type]} sources Array of source objects
   * @private
   */
  sourceList_(sources) {
    var sourceTech = this.selectSource(sources);

    if (sourceTech) {
      if (sourceTech.tech === this.techName) {
        // if this technology is already loaded, set the source
        this.src(sourceTech.source);
      } else {
        // load this technology with the chosen source
        this.loadTech(sourceTech.tech, sourceTech.source);
      }
    } else {
      // We need to wrap this in a timeout to give folks a chance to add error event handlers
      this.setTimeout( function() {
        this.error({ code: 4, message: this.localize(this.options()['notSupportedMessage']) });
      }, 0);

      // we could not find an appropriate tech, but let's still notify the delegate that this is it
      // this needs a better comment about why this is needed
      this.triggerReady();
    }
  }

  /**
   * Begin loading the src data.
   * @return {Player} Returns the player
   */
  load() {
    this.techCall('load');
    return this;
  }

  /**
   * Returns the fully qualified URL of the current source value e.g. http://mysite.com/video.mp4
   * Can be used in conjuction with `currentType` to assist in rebuilding the current source object.
   * @return {String} The current source
   */
  currentSrc() {
    return this.techGet('currentSrc') || this.cache_.src || '';
  }

  /**
   * Get the current source type e.g. video/mp4
   * This can allow you rebuild the current source object so that you could load the same
   * source and tech later
   * @return {String} The source MIME type
   */
  currentType() {
      return this.currentType_ || '';
  }

  /**
   * Get or set the preload attribute.
   * @return {String} The preload attribute value when getting
   * @return {Player} Returns the player when setting
   */
  preload(value) {
    if (value !== undefined) {
      this.techCall('setPreload', value);
      this.options_['preload'] = value;
      return this;
    }
    return this.techGet('preload');
  }

  /**
   * Get or set the autoplay attribute.
   * @return {String} The autoplay attribute value when getting
   * @return {Player} Returns the player when setting
   */
  autoplay(value) {
    if (value !== undefined) {
      this.techCall('setAutoplay', value);
      this.options_['autoplay'] = value;
      return this;
    }
    return this.techGet('autoplay', value);
  }

  /**
   * Get or set the loop attribute on the video element.
   * @return {String} The loop attribute value when getting
   * @return {Player} Returns the player when setting
   */
  loop(value) {
    if (value !== undefined) {
      this.techCall('setLoop', value);
      this.options_['loop'] = value;
      return this;
    }
    return this.techGet('loop');
  }

  /**
   * get or set the poster image source url
   *
   * ##### EXAMPLE:
   *
   *     // getting
   *     var currentPoster = myPlayer.poster();
   *
   *     // setting
   *     myPlayer.poster('http://example.com/myImage.jpg');
   *
   * @param  {String=} [src] Poster image source URL
   * @return {String} poster URL when getting
   * @return {Player} self when setting
   */
  poster(src) {
    if (src === undefined) {
      return this.poster_;
    }

    // The correct way to remove a poster is to set as an empty string
    // other falsey values will throw errors
    if (!src) {
      src = '';
    }

    // update the internal poster variable
    this.poster_ = src;

    // update the tech's poster
    this.techCall('setPoster', src);

    // alert components that the poster has been set
    this.trigger('posterchange');

    return this;
  }

  /**
   * Get or set whether or not the controls are showing.
   * @param  {Boolean} controls Set controls to showing or not
   * @return {Boolean}    Controls are showing
   */
  controls(bool) {
    if (bool !== undefined) {
      bool = !!bool; // force boolean
      // Don't trigger a change event unless it actually changed
      if (this.controls_ !== bool) {
        this.controls_ = bool;
        if (bool) {
          this.removeClass('vjs-controls-disabled');
          this.addClass('vjs-controls-enabled');
          this.trigger('controlsenabled');
        } else {
          this.removeClass('vjs-controls-enabled');
          this.addClass('vjs-controls-disabled');
          this.trigger('controlsdisabled');
        }
      }
      return this;
    }
    return !!this.controls_;
  }

  /**
   * Toggle native controls on/off. Native controls are the controls built into
   * devices (e.g. default iPhone controls), Flash, or other techs
   * (e.g. Vimeo Controls)
   *
   * **This should only be set by the current tech, because only the tech knows
   * if it can support native controls**
   *
   * @param  {Boolean} bool    True signals that native controls are on
   * @return {Player}      Returns the player
   * @private
   */
  usingNativeControls(bool) {
    if (bool !== undefined) {
      bool = !!bool; // force boolean
      // Don't trigger a change event unless it actually changed
      if (this.usingNativeControls_ !== bool) {
        this.usingNativeControls_ = bool;
        if (bool) {
          this.addClass('vjs-using-native-controls');

          /**
           * player is using the native device controls
           *
           * @event usingnativecontrols
           * @memberof Player
           * @instance
           * @private
           */
          this.trigger('usingnativecontrols');
        } else {
          this.removeClass('vjs-using-native-controls');

          /**
           * player is using the custom HTML controls
           *
           * @event usingcustomcontrols
           * @memberof Player
           * @instance
           * @private
           */
          this.trigger('usingcustomcontrols');
        }
      }
      return this;
    }
    return !!this.usingNativeControls_;
  }

  /**
   * Set or get the current MediaError
   * @param  {*} err A MediaError or a String/Number to be turned into a MediaError
   * @return {MediaError|null}     when getting
   * @return {Player}              when setting
   */
  error(err) {
    if (err === undefined) {
      return this.error_ || null;
    }

    // restoring to default
    if (err === null) {
      this.error_ = err;
      this.removeClass('vjs-error');
      return this;
    }

    // error instance
    if (err instanceof MediaError) {
      this.error_ = err;
    } else {
      this.error_ = new MediaError(err);
    }

    // fire an error event on the player
    this.trigger('error');

    // add the vjs-error classname to the player
    this.addClass('vjs-error');

    // log the name of the error type and any message
    // ie8 just logs "[object object]" if you just log the error object
    Lib.log.error(`(CODE:${this.error_.code} ${MediaError.errorTypes[this.error_.code]})`, this.error_.message, this.error_);

    return this;
  }

  /**
   * Returns whether or not the player is in the "ended" state.
   * @return {Boolean} True if the player is in the ended state, false if not.
   */
  ended() { return this.techGet('ended'); }

  /**
   * Returns whether or not the player is in the "seeking" state.
   * @return {Boolean} True if the player is in the seeking state, false if not.
   */
  seeking() { return this.techGet('seeking'); }

  reportUserActivity(event) {
    this.userActivity_ = true;
  }

  userActive(bool) {
    if (bool !== undefined) {
      bool = !!bool;
      if (bool !== this.userActive_) {
        this.userActive_ = bool;
        if (bool) {
          // If the user was inactive and is now active we want to reset the
          // inactivity timer
          this.userActivity_ = true;
          this.removeClass('vjs-user-inactive');
          this.addClass('vjs-user-active');
          this.trigger('useractive');
        } else {
          // We're switching the state to inactive manually, so erase any other
          // activity
          this.userActivity_ = false;

          // Chrome/Safari/IE have bugs where when you change the cursor it can
          // trigger a mousemove event. This causes an issue when you're hiding
          // the cursor when the user is inactive, and a mousemove signals user
          // activity. Making it impossible to go into inactive mode. Specifically
          // this happens in fullscreen when we really need to hide the cursor.
          //
          // When this gets resolved in ALL browsers it can be removed
          // https://code.google.com/p/chromium/issues/detail?id=103041
          if(this.tech) {
            this.tech.one('mousemove', function(e){
              e.stopPropagation();
              e.preventDefault();
            });
          }

          this.removeClass('vjs-user-active');
          this.addClass('vjs-user-inactive');
          this.trigger('userinactive');
        }
      }
      return this;
    }
    return this.userActive_;
  }

  listenForUserActivity() {
    let mouseInProgress, lastMoveX, lastMoveY;

    let handleActivity = Lib.bind(this, this.reportUserActivity);

    let handleMouseMove = function(e) {
      // #1068 - Prevent mousemove spamming
      // Chrome Bug: https://code.google.com/p/chromium/issues/detail?id=366970
      if(e.screenX != lastMoveX || e.screenY != lastMoveY) {
        lastMoveX = e.screenX;
        lastMoveY = e.screenY;
        handleActivity();
      }
    };

    let handleMouseDown = function() {
      handleActivity();
      // For as long as the they are touching the device or have their mouse down,
      // we consider them active even if they're not moving their finger or mouse.
      // So we want to continue to update that they are active
      this.clearInterval(mouseInProgress);
      // Setting userActivity=true now and setting the interval to the same time
      // as the activityCheck interval (250) should ensure we never miss the
      // next activityCheck
      mouseInProgress = this.setInterval(handleActivity, 250);
    };

    let handleMouseUp = function(event) {
      handleActivity();
      // Stop the interval that maintains activity if the mouse/touch is down
      this.clearInterval(mouseInProgress);
    };

    // Any mouse movement will be considered user activity
    this.on('mousedown', handleMouseDown);
    this.on('mousemove', handleMouseMove);
    this.on('mouseup', handleMouseUp);

    // Listen for keyboard navigation
    // Shouldn't need to use inProgress interval because of key repeat
    this.on('keydown', handleActivity);
    this.on('keyup', handleActivity);

    // Run an interval every 250 milliseconds instead of stuffing everything into
    // the mousemove/touchmove function itself, to prevent performance degradation.
    // `this.reportUserActivity` simply sets this.userActivity_ to true, which
    // then gets picked up by this loop
    // http://ejohn.org/blog/learning-from-twitter/
    let activityCheck = this.setInterval(function() {
      let inactivityTimeout;

      // Check to see if mouse/touch activity has happened
      if (this.userActivity_) {
        // Reset the activity tracker
        this.userActivity_ = false;

        // If the user state was inactive, set the state to active
        this.userActive(true);

        // Clear any existing inactivity timeout to start the timer over
        this.clearTimeout(inactivityTimeout);

        var timeout = this.options()['inactivityTimeout'];
        if (timeout > 0) {
          // In <timeout> milliseconds, if no more activity has occurred the
          // user will be considered inactive
          inactivityTimeout = this.setTimeout(function () {
            // Protect against the case where the inactivityTimeout can trigger just
            // before the next user activity is picked up by the activityCheck loop
            // causing a flicker
            if (!this.userActivity_) {
                this.userActive(false);
            }
          }, timeout);
        }
      }
    }, 250);
  }

  /**
   * Gets or sets the current playback rate.  A playback rate of
   * 1.0 represents normal speed and 0.5 would indicate half-speed
   * playback, for instance.
   * @param  {Number} rate    New playback rate to set.
   * @return {Number}         Returns the new playback rate when setting
   * @return {Number}         Returns the current playback rate when getting
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-playbackrate
   */
  playbackRate(rate) {
    if (rate !== undefined) {
      this.techCall('setPlaybackRate', rate);
      return this;
    }

    if (this.tech && this.tech['featuresPlaybackRate']) {
      return this.techGet('playbackRate');
    } else {
      return 1.0;
    }
  }

  /**
   * Gets or sets the audio flag
   *
   * @param  {Boolean} bool    True signals that this is an audio player.
   * @return {Boolean}         Returns true if player is audio, false if not when getting
   * @return {Player}      Returns the player if setting
   * @private
   */
  isAudio(bool) {
    if (bool !== undefined) {
      this.isAudio_ = !!bool;
      return this;
    }

    return !!this.isAudio_;
  }

  /**
   * Returns the current state of network activity for the element, from
   * the codes in the list below.
   * - NETWORK_EMPTY (numeric value 0)
   *   The element has not yet been initialised. All attributes are in
   *   their initial states.
   * - NETWORK_IDLE (numeric value 1)
   *   The element's resource selection algorithm is active and has
   *   selected a resource, but it is not actually using the network at
   *   this time.
   * - NETWORK_LOADING (numeric value 2)
   *   The user agent is actively trying to download data.
   * - NETWORK_NO_SOURCE (numeric value 3)
   *   The element's resource selection algorithm is active, but it has
   *   not yet found a resource to use.
   * @return {Number} the current network activity state
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#network-states
   */
  networkState() {
    return this.techGet('networkState');
  }

  /**
   * Returns a value that expresses the current state of the element
   * with respect to rendering the current playback position, from the
   * codes in the list below.
   * - HAVE_NOTHING (numeric value 0)
   *   No information regarding the media resource is available.
   * - HAVE_METADATA (numeric value 1)
   *   Enough of the resource has been obtained that the duration of the
   *   resource is available.
   * - HAVE_CURRENT_DATA (numeric value 2)
   *   Data for the immediate current playback position is available.
   * - HAVE_FUTURE_DATA (numeric value 3)
   *   Data for the immediate current playback position is available, as
   *   well as enough data for the user agent to advance the current
   *   playback position in the direction of playback.
   * - HAVE_ENOUGH_DATA (numeric value 4)
   *   The user agent estimates that enough data is available for
   *   playback to proceed uninterrupted.
   * @return {Number} the current playback rendering state
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-readystate
   */
  readyState() {
    return this.techGet('readyState');
  }

  /**
   * Text tracks are tracks of timed text events.
   * Captions - text displayed over the video for the hearing impaired
   * Subtitles - text displayed over the video for those who don't understand language in the video
   * Chapters - text displayed in a menu allowing the user to jump to particular points (chapters) in the video
   * Descriptions (not supported yet) - audio descriptions that are read back to the user by a screen reading device
   */

  /**
   * Get an array of associated text tracks. captions, subtitles, chapters, descriptions
   * http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-media-texttracks
   * @return {Array}           Array of track objects
   */
  textTracks() {
    // cannot use techGet directly because it checks to see whether the tech is ready.
    // Flash is unlikely to be ready in time but textTracks should still work.
    return this.tech && this.tech['textTracks']();
  }

  remoteTextTracks() {
    return this.tech && this.tech['remoteTextTracks']();
  }

  /**
   * Add a text track
   * In addition to the W3C settings we allow adding additional info through options.
   * http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-media-addtexttrack
   * @param {String}  kind        Captions, subtitles, chapters, descriptions, or metadata
   * @param {String=} label       Optional label
   * @param {String=} language    Optional language
   */
  addTextTrack(kind, label, language) {
    return this.tech && this.tech['addTextTrack'](kind, label, language);
  }

  addRemoteTextTrack(options) {
    return this.tech && this.tech['addRemoteTextTrack'](options);
  }

  removeRemoteTextTrack(track) {
    this.tech && this.tech['removeRemoteTextTrack'](track);
  }

  // Methods to add support for
  // initialTime: function(){ return this.techCall('initialTime'); },
  // startOffsetTime: function(){ return this.techCall('startOffsetTime'); },
  // played: function(){ return this.techCall('played'); },
  // seekable: function(){ return this.techCall('seekable'); },
  // videoTracks: function(){ return this.techCall('videoTracks'); },
  // audioTracks: function(){ return this.techCall('audioTracks'); },
  // videoWidth: function(){ return this.techCall('videoWidth'); },
  // videoHeight: function(){ return this.techCall('videoHeight'); },
  // defaultPlaybackRate: function(){ return this.techCall('defaultPlaybackRate'); },
  // mediaGroup: function(){ return this.techCall('mediaGroup'); },
  // controller: function(){ return this.techCall('controller'); },
  // defaultMuted: function(){ return this.techCall('defaultMuted'); }

  // TODO
  // currentSrcList: the array of sources including other formats and bitrates
  // playList: array of source lists in order of playback

  /**
   * The player's language code
   * @param  {String} languageCode  The locale string
   * @return {String}             The locale string when getting
   * @return {Player}         self, when setting
   */
  language(languageCode) {
    if (languageCode === undefined) {
      return this.language_;
    }

    this.language_ = languageCode;
    return this;
  }

  /**
   * Get the player's language dictionary
   */
  languages() {
    return this.languages_;
  }

  static getTagSettings(tag) {
    let baseOptions = {
      'sources': [],
      'tracks': []
    };

    const tagOptions = Lib.getElementAttributes(tag);
    const dataSetup = tagOptions['data-setup'];

    // Check if data-setup attr exists.
    if (dataSetup !== null){
      // Parse options JSON
      // If empty string, make it a parsable json object.
      Lib.obj.merge(tagOptions, safeParseTuple(dataSetup || '{}')[1]);
    }

    Lib.obj.merge(baseOptions, tagOptions);

    // Get tag children settings
    if (tag.hasChildNodes()) {
      const children = tag.childNodes;

      for (let i=0, j=children.length; i<j; i++) {
        const child = children[i];
        // Change case needed: http://ejohn.org/blog/nodename-case-sensitivity/
        const childName = child.nodeName.toLowerCase();
        if (childName === 'source') {
          baseOptions['sources'].push(Lib.getElementAttributes(child));
        } else if (childName === 'track') {
          baseOptions['tracks'].push(Lib.getElementAttributes(child));
        }
      }
    }

    return baseOptions;
  }

}

/**
 * Global player list
 * @type {Object}
 */
Player.players = {};

/**
 * Player instance options, surfaced using options
 * options = Player.prototype.options_
 * Make changes in options, not here.
 * All options should use string keys so they avoid
 * renaming by closure compiler
 * @type {Object}
 * @private
 */
Player.prototype.options_ = Options;

/**
 * Fired when the player has initial duration and dimension information
 * @event loadedmetadata
 */
Player.prototype.handleLoadedMetaData;

/**
 * Fired when the player has downloaded data at the current playback position
 * @event loadeddata
 */
Player.prototype.handleLoadedData;

/**
 * Fired when the player has finished downloading the source data
 * @event loadedalldata
 */
Player.prototype.handleLoadedAllData;

/**
 * Fired when the user is active, e.g. moves the mouse over the player
 * @event useractive
 */
Player.prototype.handleUserActive;

/**
 * Fired when the user is inactive, e.g. a short delay after the last mouse move or control interaction
 * @event userinactive
 */
Player.prototype.handleUserInactive;

/**
 * Fired when the current playback position has changed
 *
 * During playback this is fired every 15-250 milliseconds, depending on the
 * playback technology in use.
 * @event timeupdate
 */
Player.prototype.handleTimeUpdate;

/**
 * Fired when the volume changes
 * @event volumechange
 */
Player.prototype.handleVolumeChange;

/**
 * Fired when an error occurs
 * @event error
 */
Player.prototype.handleError;

Player.prototype.flexNotSupported_ = function() {
  var elem = document.createElement('i');

  return !('flexBasis' in elem.style ||
          'webkitFlexBasis' in elem.style ||
          'mozFlexBasis' in elem.style ||
          'msFlexBasis' in elem.style);
};

Component.registerComponent('Player', Player);
export default Player;
