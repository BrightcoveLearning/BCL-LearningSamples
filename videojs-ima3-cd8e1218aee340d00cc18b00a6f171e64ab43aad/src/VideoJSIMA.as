package {

  import com.google.ads.ima.api.Ad;
  import com.google.ads.ima.api.AdErrorEvent;
  import com.google.ads.ima.api.AdEvent;
  import com.google.ads.ima.api.AdPodInfo;
  import com.google.ads.ima.api.AdsLoader;
  import com.google.ads.ima.api.AdsManager;
  import com.google.ads.ima.api.AdsManagerLoadedEvent;
  import com.google.ads.ima.api.AdsRenderingSettings;
  import com.google.ads.ima.api.AdsRequest;
  import com.google.ads.ima.api.ViewModes;

  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import flash.events.MouseEvent;
  import flash.events.TimerEvent;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.ui.ContextMenu;
  import flash.ui.ContextMenuItem;
  import flash.utils.Timer;

  [SWF(backgroundColor="#000000", frameRate="60", width="640", height="360")]
  public class VideoJSIMA extends Sprite {
    private static const VERSION:String = CONFIG::version;
    private var adsLoader:AdsLoader;
    private var adsManager:AdsManager;
    private var contentPlayheadTime:Number = 0;
    private var currentAd:Ad;
    private var _stageSizeTimer:Timer;
    private var _contentPlayerId:String;
    private var _paused:Boolean;
    private var _settings:Object = {};
    private var _debug:Boolean;

    private var adProperties:Array = [
      "adSkippableState",
      "adSystem",
      "contentType",
      "currentTime",
      "description",
      "duration",
      "height",
      "id",
      "linear",
      "mediaUrl",
      "minSuggestedDuration",
      "remainingTime",
      "skippable",
      "title",
      "width",
    ];
    private var adPodInfoProperties:Array = [
      // ad pod info items
      'adPosition',
      'isBumper',
      'maxDuration',
      'podIndex',
      'timeOffset',
      'totalAds'
    ];


    public function VideoJSIMA() {
      _stageSizeTimer = new Timer(250);
      _stageSizeTimer.addEventListener(TimerEvent.TIMER, onStageSizeTimerTick);
      addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
    }

    private function init():void {
      // Allow JS calls from other domains
      Security.allowDomain("*");
      Security.allowInsecureDomain("*");

      if(loaderInfo.parameters.playerId)
      {
        _debug = loaderInfo.parameters.debug === "true";
        _contentPlayerId = loaderInfo.parameters.playerId;

        console("IMA SWF VERSION:" + VERSION);
        console('registered a content player at ' + _contentPlayerId );
      }

      // expose callbacks to javascript
      ExternalInterface.addCallback('vjs_trigger', onTrigger);
      ExternalInterface.addCallback('vjs_play', onPlay);
      ExternalInterface.addCallback('vjs_pause', onPause);
      ExternalInterface.addCallback('vjs_volume', onVolume);
      ExternalInterface.addCallback('vjs_duration', duration);
      ExternalInterface.addCallback('vjs_currentTime', currentTime);
      ExternalInterface.addCallback('vjs_totalAdsDuration', totalAdsDuration);
      ExternalInterface.addCallback('vjs_getRemainingTime', getRemainingTime);
      ExternalInterface.addCallback('vjs_paused', onPaused);
      ExternalInterface.addCallback('vjs_postrolltimeout', onPostrollTimeout);
      ExternalInterface.addCallback('vjs_autoplayadbreaks', onAutoPlayAdBreaks);
      ExternalInterface.addCallback('vjs_currentAd', onCurrentAd);
      ExternalInterface.addCallback('vjs_destroyAdsManager', destroyAdsManager);

      // add content-menu version info
      var _ctxVersion:ContextMenuItem = new ContextMenuItem("VideoJS Flash IMA Component v" + VERSION, false, false);
      var _ctxAbout:ContextMenuItem = new ContextMenuItem("Copyright © 2013 Brightcove, Inc.", false, false);
      var _ctxMenu:ContextMenu = new ContextMenu();
      _ctxMenu.hideBuiltInItems();
      _ctxMenu.customItems.push(_ctxVersion, _ctxAbout);
      this.contextMenu = _ctxMenu;

      if(loaderInfo.parameters.playerId) {
        _contentPlayerId = loaderInfo.parameters.playerId;
      }
      initAdsLoader();
    }

    /**
     * Handler for on-demand ad requests
     */
    public function requestAdsButtonHandler(adTag:String):void {
      playerCall('ads.startLinearAdMode');
      destroyAdsManager();
      requestAds(adTag);
      // we are waiting for an adLoaded event
      // display spinner animation
      playerCall('addClass', 'ima3-ad-loading');
    }

    /**
     * Instantiate the AdsLoader and load the SDK
     */
    private function initAdsLoader():void {
      if (adsLoader == null) {
        console('init ads loader');
        // On the first request, create the AdsLoader.
        adsLoader = new AdsLoader();
        adsLoader.settings.playerVersion = VERSION;
        adsLoader.settings.playerType = 'brightcove/player-flash';
        // The SDK uses a 2 stage loading process. Without this call, the second
        // loading stage will take place when ads are requested. Including this
        // call will decrease latency in starting ad playback.
        adsLoader.loadSdk();
        adsLoader.addEventListener(AdsManagerLoadedEvent.ADS_MANAGER_LOADED, adsManagerLoadedHandler);
        adsLoader.addEventListener(AdErrorEvent.AD_ERROR, adsLoadErrorHandler);
      }
    }

    /**
     * Request ads using the specified ad tag.
     *
     * @param adTag A URL that will return a valid VAST response.
     */
    public function requestAds(adTag:String):void {
      console('request ads ' + adTag);
      if (!adTag) {
        adPlayerTrigger('adscanceled');
        return;
      }
      // The AdsRequest encapsulates all the properties required to request ads.
      var adsRequest:AdsRequest = new AdsRequest();
      adsRequest.adTagUrl = adTag;
      adsRequest.linearAdSlotWidth = stage.stageWidth;
      adsRequest.linearAdSlotHeight = stage.stageHeight;
      adsRequest.nonLinearAdSlotWidth = stage.stageWidth;
      adsRequest.nonLinearAdSlotHeight = stage.stageHeight;

      // Instruct the AdsLoader to request ads using the AdsRequest object.
      adsLoader.requestAds(adsRequest);
      adPlayerTrigger('ads-request');
    }

    /**
     * Invoked when the AdsLoader successfully fetched ads.
     */
    private function adsManagerLoadedHandler(event:AdsManagerLoadedEvent):void {
      console('loaded ads manager');

      // Publishers can modify the default preferences through this object.
      var adsRenderingSettings:AdsRenderingSettings =
        new AdsRenderingSettings();

      // In order to support VMAP ads, ads manager requires an object that
      // provides current playhead position for the content.
      var contentPlayhead:Object = {};
      contentPlayhead.time = function():Number {
        return contentPlayheadTime * 1000; // convert to milliseconds.
      };

      // Get a reference to the AdsManager object through the event object.
      adsManager = event.getAdsManager(contentPlayhead, adsRenderingSettings);
      if (adsManager) {
        // Add required ads manager listeners.
        // ALL_ADS_COMPLETED event will fire once all the ads have played. There
        // might be more than one ad played in the case of ad pods and VMAP.
        adsManager.addEventListener(AdEvent.ALL_ADS_COMPLETED, allAdsCompletedHandler);
        adsManager.addEventListener(AdEvent.DURATION_CHANGED, onAdsDurationChangeHandler);
        // If ad is linear, it will fire content pause request event.
        adsManager.addEventListener(AdEvent.CONTENT_PAUSE_REQUESTED, contentPauseRequestedHandler);
        // When ad finishes or if ad is non-linear, content resume event will be
        // fired. For example, if VMAP response only has post-roll, content
        // resume will be fired for pre-roll ad (which is not present) to signal
        // that content should be started or resumed.
        adsManager.addEventListener(AdEvent.CONTENT_RESUME_REQUESTED, contentResumeRequestedHandler);
        // we want to know when an ad has loaded
        adsManager.addEventListener(AdEvent.LOADED, adLoadedHandler);
        // We want to know when an ad starts.
        adsManager.addEventListener(AdEvent.STARTED, startedHandler);
        adsManager.addEventListener(AdEvent.PAUSED, pausedHandler);
        adsManager.addEventListener(AdEvent.RESUMED, resumedHandler);
        adsManager.addEventListener(AdEvent.COMPLETED, completedHandler);
        adsManager.addEventListener(AdErrorEvent.AD_ERROR, adsManagerPlayErrorHandler);
        //Adding the required additional events that are needed for universal translation of BC Flash events
        adsManager.addEventListener(AdEvent.FIRST_QUARTILE, triggerContribAdEvent('ima3-first-quartile'));
        adsManager.addEventListener(AdEvent.MIDPOINT, triggerContribAdEvent('ima3-midpoint'));
        adsManager.addEventListener(AdEvent.THIRD_QUARTILE, triggerContribAdEvent('ima3-third-quartile'));
        adsManager.addEventListener(AdEvent.VOLUME_CHANGED, triggerContribAdEvent('ima3-volume-changed'));
        adsManager.addEventListener(AdEvent.CLICKED, triggerContribAdEvent('ima3-click'));
        // If your video player supports a specific version of VPAID ads, pass
        // in the version. If your video player does not support VPAID ads yet,
        // just pass in 1.0.
        adsManager.handshakeVersion("2.0");

        // Add the adsContainer to the display list
        addChild(adsManager.adsContainer);

        //Once an adManager is created you need to start it.
        if('ad-playback' === playerGet('ads.state')) {
          //In the case of an on-demand request we do this immediately.
          startAdsManager();
        } else {
          //if this isn't an ondemand case, its the typical adrequest on startup
          //and we just trigger adsready to finish the preroll handhake with contrib-ads
          //The admanager will be started later, when it gets a readyforpreroll event.
          playerCall('trigger', 'adsready');
        }
      }
    }
    
    //** Writing a function as below that will be reused to call and trigger the additional trnaslated BC Universal Ad events **
    private function triggerContribAdEvent(BCEventName){
      return function(){
        adPlayerTrigger(BCEventName);
      };
    }
    /**
     * Clean up AdsManager references when no longer needed. Explicit cleanup
     * is necessary to prevent memory leaks.
     */
    private function destroyAdsManager():void {
      if (adsManager) {
        if (adsManager.adsContainer.parent &&
            adsManager.adsContainer.parent.contains(adsManager.adsContainer)) {
          adsManager.adsContainer.parent.removeChild(adsManager.adsContainer);
        }
        adsManager.destroy();
        console('destroyed ads manager');
        playerCall('removeClass', 'ima3-ad-loading');
      }
    }

    /**
     * The AdsManager raises this event when all ads for the request have been
     * played.
     */
    private function allAdsCompletedHandler(event:AdEvent):void {
      // Ads manager can be destroyed after all of its ads have played.
      adPlayerTrigger('ima3-all-ads-completed');
      destroyAdsManager();
      console('All ads have completed');
    }


    /**
     * The AdsManager raises this event when it requests the publisher to pause
     * the content.
     */
    private function contentPauseRequestedHandler(event:AdEvent):void {
      console('content pause request at ' + contentPlayheadTime);
      //Todo if i have an ad, and it is linear, and it is preroll, play it

      if(_contentPlayerId)
      {
        // if player ads state is `ad-playback`, do not call startLinearAdmode()
        // because that will trigger 2nd `adstart`.
        if('ad-playback' !== playerGet('ads.state')) {
          console('sending back startlinearadmode');
          playerCall('ads.startLinearAdMode');
          adPlayerTrigger('ads-pod-started');
          //we are still waiting for an adLoaded event
          //display spinner animation
          playerCall('addClass', 'ima3-ad-loading');
        }
        adPlayerTrigger('play');
      }

    }

    /**
     * If an error occurs during the ads manager play, the content should be
     * resumed. In this example, the content is resumed if there's an error
     * playing ads.
     */
    private function adsManagerPlayErrorHandler(event:AdErrorEvent):void {
      console("Ad playback error: " + event.error.errorMessage);
      destroyAdsManager();
      adPlayerTrigger('adserror');
    }

    /**
     * If an error occurs during the ads load, the content can be resumed or
     * another ads request can be made. In this example, the content is resumed
     * if there's an error loading ads.
     */
    private function adsLoadErrorHandler(event:AdErrorEvent):void {
      console('AdsLoader error ' + event.error.errorCode + ': ' + event.error.errorMessage);
      playerCall('removeClass', 'ima3-ad-loading');
      adPlayerTrigger('adserror');
    }

    /**
     * The AdsManager raises this event when it requests the publisher to resume
     * the content.
     */
    private function contentResumeRequestedHandler(event:AdEvent):void {
      console('content resume request');
      if(_contentPlayerId)
      {
        currentAd = null;
        ExternalInterface.call('function() { delete videojs.getPlayers()["' + _contentPlayerId + '"].ima3.currentAd; }');
        console('sending back endlinearadmode');
        playerCall('ads.endLinearAdMode');
        adPlayerTrigger('ads-pod-ended');
        playerCall('removeClass', 'ima3-ad-loading');
      }
    }
    /**
     * AdManager dispatches 'loaded' when an ad has finished loading.
     */
    private function adLoadedHandler(event:AdEvent):void {
      console('An ad has loaded');
      adPlayerTrigger('ads-load');
      // A linear ad had loaded. It's time to remove spinner animation.
      if(event.ad.linear) {
        playerCall('removeClass', 'ima3-ad-loading');
        
      }
    }
    /**
     * The AdsManager raises this event when the ad has started.
     */
    private function startedHandler(event:AdEvent):void {
      console('An ad has started');
      if(event.ad.linear) {
        currentAd = event.ad;

        var jsonablead = filterObject(currentAd, adProperties);
        jsonablead.adPodInfo = filterObject(currentAd.adPodInfo, adPodInfoProperties);

        ExternalInterface.call(
            'function(ad) { videojs.getPlayers()["' + _contentPlayerId + '"].ima3.currentAd = ad; }',
            jsonablead);

        _paused = false;
        playerCall('removeClass', 'ima3-ad-loading');
      } else {
        playerCall('addClass', 'vjs-ima3-overlay');
      }
      adPlayerTrigger('ima3-started');
    }

    private function pausedHandler(event:AdEvent):void {
      if(event.ad.linear)
      {
        _paused = true;
        adPlayerTrigger('ima3-paused');
      }
    }

    private function resumedHandler(event:AdEvent):void {
      if(event.ad.linear)
      {
        _paused = false;
        adPlayerTrigger('ima3-resumed');
      }
    }

    private function completedHandler(event:AdEvent):void {
      console('An ad has completed');
      playerCall('removeClass', 'vjs-ima3-overlay');
      playerCall('addClass', 'ima3-ad-loading');
      adPlayerTrigger('ima3-complete')
    }

    private function onAdsDurationChangeHandler(event:AdEvent):void {
      //This method is called when the user interact with the Ad.
      adPlayerTrigger('durationchange');
    }

    /**
    * Automatically called on content update.
    * @param    value   ima3 plugin options
     */
    private function onContentUpdate(value:*):void {
      console('External call for onContentUpdate received');
      // clean up the old AdsManager, if one exists. this is a no-op
      // if there is no current AdsManager.
      destroyAdsManager();
      requestAds(value.serverUrl);
    }

    private function startAdsManager():void {
      // Init should be called before playing the content in order for VMAP
      // ads to function correctly.
      adsManager.init(stage.stageWidth, stage.stageHeight, ViewModes.NORMAL);
      // Start the ad playback.
      adsManager.start();
    }

    private function onReadyForPreroll():void {
      console('External call for onReadyForPreroll received');
      // Start linear ad mode immediately if a preroll is scheduled
      if (adsManager.cuePoints.length && adsManager.cuePoints[0] === 0) {
        playerCall('ads.startLinearAdMode');
        // we are still waiting for an adLoaded event
        // display spinner animation
        playerCall('addClass', 'ima3-ad-loading');
      }
      startAdsManager();
    }

    private function onContentComplete():void {
      console('External call for onContentComplete received');
      // inform the AdsLoader when content ends to trigger postrolls
      adsLoader.contentComplete();
    }

    private function jsCall(player:String, method:String, args:Array):void {
      // serializing the result of the call can be expensive and we never use it
      // so wrap our invocation in a function that will always return `undefined`
      var call:String = '(function(){\n  var player = ' + player + ';\n' +
        '  player.' + method + '.apply(player, arguments);\n})';
      args.unshift(call);
      ExternalInterface.call.apply(null, args);
    }

    private function jsGet(player:String, property:String):String {
      var func:String = '(function(){\n  var player = ' + player + ';\n' +
        '  return player.' + property + ';\n})';
      return ExternalInterface.call(func);
    }

    private function playerCall(method:String, ... args):* {
      return jsCall('videojs.getPlayers()["' + _contentPlayerId + '"]', method, args);
    }

    private function playerGet(property:String):* {
      return jsGet('videojs.getPlayers()["' + _contentPlayerId + '"]', property);
    }

    /**
     * Triggers player events using perform jasvascript library
     * @param    event   The perform event type
     */
    private function adPlayerTrigger(event:String):* {
      return jsCall('videojs.getPlayers()["' + _contentPlayerId + '"].ima3.adPlayer',
                    'trigger',
                    [event]);
    }

    private function console(value:*):void {
      if(_debug)
      {
        try{
          ExternalInterface.call('window.console.log', "["+ExternalInterface.objectID+"]", value);
        } catch(err:Error) {

        }
      }
    }

    private function filterObject(obj:Object, filterList:Array):Object {
      var newObj = {};

      for each (var p in filterList) {
        newObj[p] = obj[p];
      }
      return newObj;
    }

    private function onStageSizeTimerTick(e:TimerEvent):void{
      if(stage.stageWidth > 0 && stage.stageHeight > 0){
        _stageSizeTimer.stop();
        _stageSizeTimer.removeEventListener(TimerEvent.TIMER, onStageSizeTimerTick);
        init();
      }
    }

    private function onStageResize(e:Event):void{
      if (adsManager) {
        adsManager.resize(stage.stageWidth, stage.stageHeight, ViewModes.NORMAL);
      }
    }

    private function onAddedToStage(e:Event):void{
      console('stage resized:' +stage.stageWidth + 'x' + stage.stageHeight);
      stage.addEventListener(Event.RESIZE, onStageResize);
      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;
      _stageSizeTimer.start();

      // kick off initialization
      onStageSizeTimerTick(null);
    }

    private function onTimeUpdate(event:*):void {
      contentPlayheadTime = event.currentTime;
    }

    private function onPlay():void {
      if(adsManager)
      {
        adsManager.resume();
      } else {
        console('No ads manager instantiated, cannot play');
      }
    }

    private function onPause():void {
      if(adsManager)
      {
        adsManager.pause();
      } else {
        console('No ads manager instantiated, cannot pause');
      }
    }

    private function onPaused():Boolean {
      return _paused;
    }

    private function onPostrollTimeout():void {
      if (adsManager) {
        destroyAdsManager();
      }
    }

    private function onAutoPlayAdBreaks(autoPlayAdBreaks:Boolean):void {
      if (adsLoader) {
        adsLoader.settings.autoPlayAdBreaks = autoPlayAdBreaks;
      }
    }

    private function onCurrentAd():Ad {
      return currentAd;
    }

    private function onVolume(volume:Number=-1):Number {
      var returnValue:Number = -1;

      if(volume==-1)
      {
        if(adsManager)
        {
          if (volume < 0 ) {
            volume = 0;
          } else if ( volume > 1 ) {
            volume = 1;
          }

          returnValue = adsManager.volume;
        }else {
          console('No ads manager instantiated, cannot get volume');
          returnValue = 1;
        }
      } else {
        if(adsManager)
        {
          if (volume < 0 ) {
            volume = 0;
          } else if ( volume > 1 ) {
            volume = 1;
          }

          adsManager.volume = volume;

          returnValue = adsManager.volume;
        } else {
          console('No ads manager instantiated, cannot set volume');
          returnValue = 1;
        }
      }

      return returnValue;

    }

    private function currentTime():Number {
      if (currentAd) {
        return currentAd.currentTime;
      } else {
        return 0;
      }
    }

    private function duration():Number {
      if (currentAd) {
        return currentAd.duration;
      } else {
        return 0;
      }
    }

    private function totalAdsDuration():Number {
      if (currentAd && currentAd.adPodInfo) {
        return currentAd.adPodInfo.maxDuration;
      } else {
        return 0;
      }
    }

    private function getRemainingTime():Number {
      if (adsManager) {
        return adsManager.remainingTime;
      } else {
        return -1;
      }
    }

    private function onTrigger(e:*):void{
      // copy over the current set of plugin options, so we're always
      // working with the most recent settings
      if (e.options) {
        _settings = e.options;
      }
      try{
        if(e.type)
        {
          switch(e.type)
          {
          case 'contentupdate':
            onContentUpdate(e.options);
            break;

          case 'adrequest':
            requestAdsButtonHandler(e.adTag);
            break;

          case 'readyforpreroll':
            onReadyForPreroll();
            break;

          case 'ended':
            onContentComplete();
            break;

          case 'timeupdate':
            onTimeUpdate(e);
            break;

          case 'debug':
            _debug = !(e.enable === false);
            break;

          default:
            break;
          }
        }
      } catch(err:Error) {
        console('Error handling player event: ' + err.toString());
      }
    }
  }
}
