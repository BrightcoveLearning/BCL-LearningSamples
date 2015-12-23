[![Build Status](http://teamcity/app/rest/builds/buildType:id:ExperimentalVideoJsIma3_Continuous/statusIcon)](http://trunkcity.vidmark.local/viewType.html?buildTypeId=ExperimentalVideoJsIma3_Continuous&guest=1)

# Interactive Media Ads (IMA) v3 for Video.js

This plugin integrates Video.js with Google's Interactive Media Ads (IMA) version 3 [for HTML5](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/) and [Flash](https://developers.google.com/interactive-media-ads/docs/sdks/flash/v3/).

## Building the Plugin

The plugin requires Grunt tasks to build a distribution package and the Flash SWF [see adSwf below]:

```bash
grunt
```

## Using the Plugin

The plugin registers itself when you include `video.ima3.js` in your page:

    <script src='videojs.ima3.js'></script>

Once you have your video object, you can activate the ima3 plugin.

    video.ima3({
      timeout: 5000
    });

If you want to override the default settings, you can provide an `options` object.
Properties on this object determine the behavior of the plugin.

The latest released version is always available on the [Brightcove plugin repo](http://players.brightcove.net/videojs-ima3/videojs.ima3.min.js).

## Options

The video.js IMA3 plugin is built on top of the [video.js ad framework](https://github.com/brightcove/videojs-ads) and accepts any options that the ad framework provides. Take a look at the ad framework [README](https://github.com/brightcove/videojs-ads/blob/master/README.md) for details on the current set of overrideable settings. In addition, the following IMA specific options are supported:

### ima3SdkSettings
Type: `object`
Default Value: undefined

If provided, the properties of this object are used to set the page-level [Ima3SdkSettings](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings) when the IMA SDK has finished loading. The properties of this object are expected to be the camel-cased equivalent of setter methods on the SDK settings object, minus the 'set' prefix. For example, if you provided this object when initializing the plugin:

```js
{
  'numRedirects': 3,
  'ppid': 'publisher-id',
}
```

Then the video.js IMA plugin would run code that looks something like this when IMA had loaded:

```js
window.google.ima.ImaSdkSettings.setNumRedirects(3);
window.google.ima.ImaSdkSettings.setPpid('publisher-id');
```

### adTechOrder
Type: `array`
Default Value: ['flash', 'html5']

The ad integration technologies to attempt to use, in order of descending
precedence. videojs-ima3 will test each ad tech in order on initialization and
use the first supported one for the lifetime of the player.

### loadingSpinner
Type: `boolean`
Default Value: false

When set to true, the `vjs-loading-spinner` is displayed while an ad loads.

### adControlBar
Type: `object`
Default Value: identical to the player control bar options

When using the Flash ad tech, a seperate set of controls are created to manage
interaction with the ad SWF. When those controls are created, these options will
be used during their initialization. If no value is specified, the configuration
settings for the regular control bar will be used.

### adSwf
Type: `string`
Default Value: 'videojs.ima3.swf'

Development Value: 'src/videojs.ima3.swf'

The path to the videojs IMA3 swf. This will be directly applied to the
object element if the Flash ad tech is used.

### clickTrackingElement
Type: `HTMLElement`
Default Value: undefined

If the HTML ad tech is being used in [custom ad
playback](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/guides/custom_playback)
mode, this specifies an alternative HTML element to be used to track
advertisement taps on devices that don't support input events over the
video element. More details are available in the parameter
documentation for the [IMA
AdDisplayContainer](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer). If
you provide a click tracking element, it is your responsibility to
show and hide it at the appropriate times on the appropriate
platforms. In most cases, it's best to leave this setting undefined
and allow the the plugin and IMA to manage ad interaction.

### requestMode
Type: `string`
Default Value: `onload`

When set to `onload`, ads are requested immediately when the player loads. Set to `onplay` to delay the first ad request until playback is initiated. Set to `ondemand` if all ad requests will be initiated using the player.ima3.adrequest() method manually. Set to `oncue` if the ads need to be triggered based on ID3 cue points. This is to support ads in live content.

## Methods

### player.ima3.adrequest()

Calling this method will create an ondemand adrequest immediately upon receiving an ad response. Invoking this method creates
a new IMA adManager which means that any previous ad response information (for instance, a postroll ad returned in a previous
VAST response) will be lost.  We recommend that you only use this method in cases where up-front knowledge of ad timings isn't
known or you will be making all ad calls on-demand. In all other cases, it makes sense to put all ad data in the intial VAST
call on plugin init.

Parameters:
adRequestUrl (String) - Path to a VAST ad tag.  You can and should pass relative urls.

Returns:
Nothing

Example:
player.ima3.adrequest('http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]');

### player.ima3.ready()

Similar to the vjs.ready() method, any callbacks passed into this method will only be invoked when the ima3 plugin is ready.  Since
the loading of the ima3 swf, can take some time, its sometimes desireable to use this function to delay calling your methods until
the swf is ready to handle them.  For example, we use this method to delay and calls to player.ima3.adrequest() that might be made
before we can handle them.

## Runtime settings
The following methods are available for both the HTML5 and Flash ad techs.

### AdsManager.destroy
Type: `google.ima.AdsManager.destory`

Calling this method destroys the current ads manager.
See [`AdsManager.destroy`](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.destroy).

### AdsManager.getRemainingTime
Type: `google.ima.AdsManager.getRemainingTime`

Calling this method returns the amount of time remaining for the current ad.
If an ad isn't available or has finished playing, it returns -1.
See [`AdsManager.getRemainingTime`](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.getRemainingTime)

### ImaSdkSettings.setAutoPlayAdBreaks
Type: `google.ima.ImaSdkSettings.setAutoPlayAdBreaks`

This method takes a boolean representing whether VMAP and ad rules are automatically played. See [`ImaSdkSettings.setAutoPlayAdBreaks`](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.setAutoPlayAdBreaks).

## HTML5 Settings
If the HTML5 ad tech is in use, a number of IMA settings are available on the
plugin object at runtime. To determine the ad ID, for instance, you would write:

```js
var adId = player.ima3.currentAd.getAdId();
```

Be careful interacting directly with these properties. Calling the wrong
method can lead to unexpected results and failure of advertisements to play properly.

### adsManager
Type: `google.ima.AdsManager`

The object responsible for playing ads. See [ima.AdsManager](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager).
The Ads Manager is not available until `adsready` has been fired by the plugin.

### currentAd
Type: `google.ima.Ad`

When an ad is playing, an object that encapsulates information about the current ad. See [ima.Ad](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.Ad).

### adDisplayContainer
Type: `google.ima.AdDisplayContainer`

The object responsible for managing the display elements for ads. See [ima.AdDisplayContainer](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer).
The Ads Display container may not be available until `adsready` has been fired by the plugin.

### adsLoader
Type: `google.ima.AdsLoader`

The object used to create ads requests. See [ima.AdsLoader](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsLoader).
The Ads Loader may not be available until `adsready` has been fired by the plugin.

## Events
The plugin emits some custom event types during loading, initialization, and playback. You can listen for IMA3 events just like you would any other event:

```js
player.on('ima3error', function(event) {
  console.log('event', event);
});
```

### ima3error
This event indicates there was an error loading the IMA3 SDK from Google. If it occurs, no ads will be displayed.

### ima3-ad-error
An error has occurred in the IMA3 SDK.
You should verify your ad configuration and settings to be sure your DoubleClick
account is correctly configured.
You can find common troubleshooting tasks at the
[DoubleClick support site](https://support.google.com/dfp_premium/) or talk to
your DoubleClick account representative.

### ima3-ready
This event indicates that the ima3 plugin code has loaded and is ready load the ima sdk.

## IMA3 HTML Playback Modes
The IMA3 HTML5 SDK has two seperate modes of operation: standard and
[custom
playback](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/ads#usingCustomAdPlayback)
mode. In standard mode, IMA3 will create a video element inside of the
AdDisplayContainer iframe to play linear ads. Custom playback mode
shares the video element with the content player and is intended for
mobile devices that do not support multiple simultaneous video
elements well. The videojs-ima3 plugin chooses which HTML5 playback
mode to use by querying the content player's `techOrder` property and
determining if any of the other content techs are supported. If
multiple techs are supported, sharing the content video element isn't
safe because it would be disposed if the current tech is unloaded. In
practice, this means desktop machines with Flash installed will
operate in standard playback mode and mobile devices without Flash
will use custom playback mode.

## Using HTML Mode with Firefox
Unlike the rest of the major browsers, Firefox does not yet support
MP4 video on OS X. If you plan on adopting an HTML-first ad policy on
Firefox, you'll need to make sure your ad creatives are available in a
format that is supported natively, like webm or ogv.

## Clickthrough Handling
The IMA3 ad display is overlaid on top of the video player during playback.
By default, that would prevent click or touch events from reaching the player.
This is not normally desirable so the default CSS only allows pointer events to reach the IMA SDK when at least one of the following conditions is true:

- When the flash ad tech is active and an ad is playing
- When the user's browser does not support touch events, the HTML ad tech is active and an ad is playing
- When the the user's browser supports touch event, player controls are visible and an ad is playing

|   |0 0|0 1|1 0|1 1|
|--:|:-:|:-:|:-:|:-:|
|0 0| 0 | 0 | 1 | 0 |
|0 1| 1 | 0 | 1 | 0 |
|1 0| 1 | 0 | 1 | 0 |
|1 1| 1 | 0 | 1 | 0 |

A [Karnaugh map](http://en.wikipedia.org/wiki/Karnaugh_map) of all the conditions under which the ad container should receive pointer events.
The first digit of the row indicates whether the player was expecting mouse input.
That digit would be a '1' if a mouse is present, a '0' for touch.
The second digit of each row indicates whether the user is active (or not).
The first digit of each column specifies whether the Flash ad tech is used.
A '0' indicates the HTML ad tech.
The second column digit is '1' if content is playing, '0' if an ad is playing.

## Resizing The Player During Ad or Video Playback
If the player is resized during ad or video playback, ad content will not resize unless the player's dimensions function is called to resize the player. Resizing the player using other methods (style width and height, for example) will not resize the ad.

## Changing playlist videos during ads
Allowing or disallowing switching videos during playlists is up to the user of this plugin.
To allow switching of the video, one would need to call `destroy` on google's ads manager and then call `endLinearAdMode` on the ads plugin.

```js
google.ima.AdsManager.destroy();
player.ads.endLinearAdMode();
```

## Known Issues
### Exceptions Generated by Overlay Ads
On Chrome 30, an exception is thrown from the IMA bridge when "fading out" an overlay ad:

```
Uncaught NotFoundError: An attempt was made to reference a Node in a context where it does not exist. bridge3.1.33.html:46
ae bridge3.1.33.html:46
Pi.I bridge3.1.33.html:121
(anonymous function) bridge3.1.33.html:93
```
This issue is evident in the [IMA VAST inspector](https://developers.google.com/interactive-media-ads/docs/vastinspector_dual) as well.

### Overlays and Fullscreen Transitions
video.js uses the [fullscreen API](http://www.w3.org/TR/fullscreen/) where
available. Different browsers implement the transition to fullscreen
differently and that can produce discrepancies in appearance when transitioning
into and out of fullscreen mode. In most implementations, the element that is
being taken into fullscreen is geometrically scaled (i.e. zoomed) from its
original to the target size. Most overlay advertisements are designed to be
displayed at a fixed size, however, and so they may appear distorted until the
animation completes.

## Release History

A short list of features, fixes and changes for each release.

### 1.13.0
 * Update contrib-ads to pick up playlist support

### 1.12.0
 * Add adrequest method
 * Add ready method
 * Add loadingSpinner option
 * Fix timings in HTML controlbar
 * Add black background div to prevent content flashing issues with prerolls and midrolls (on desktop)

### 1.11.0
 * Add error handling
 * Bump videojs-contrib-ads to 1.0.0
 * Fix race condition where contentupdate can trigger twice

### 1.10.0

 * Bump videojs-contrib-ads to 0.6.0
 * Add no-op function stubs for text track API methods

### 1.8.0

 * Bump default preroll timeout to 1000ms
 * Always use a separate control bar for ad playback. Previously, ads
   on platforms that did not support Flash would re-use the content
   control bar for ad playback.
 * Move ad container offscreen during content playback because IMA
   steals touch events on Android Chrome.

### 1.7.0

 * VPAID 2.0 support for the Flash ad tech

### 1.6.0

 * Update videojs-ads
 * Pass updated plugin settings to the ad SWF

### 1.5.0

 * Set the default ad tech order to flash, html5

### 1.4.0

 * Post-roll support
 * Added the ability to use custom click tracking elements with IMA3/HTML5

### 1.3.0

 * Upgrade to video.js 4.4.3

## Running the Unit Tests

Tests for this project are written with [QUnit](http://qunitjs.com/). Tests can be run from the command line with grunt:

```sh
grunt
```

You can also check them out in your browser of choice by opening test/videojs.ima3.html.

## Deploying

## Deploying new versions

* Confirm that the [Continuous Build](http://trunkcity/viewType.html?buildTypeId=ExperimentalVideoJsIma3_10Continuous) has passed on master with your changes.
* Trigger the [Version and Artifact Build](http://trunkcity/viewType.html?buildTypeId=ExperimentalVideoJsIma3_11CreateVersionedReleaseArtifact)
* When prompted select the [proper versioning strategy](http://semver.org/) based on your changes.
* Once, the version and artifact build is complete, trigger the [Stage to S3 Build](http://trunkcity/viewType.html?buildTypeId=ExperimentalVideoJsIma3_12StageToS3)
* Log into james: `ssh login.kar.brightcove.com`
* Find the hostname of a prodution dangerzone node: `nodeattr -s 'dangerzone&&chef_env=production'`
* ssh into the dangerzone node
* Run the following commands:

```bash
cd /usr/local/brightcove/dangerzone
sudo -u tomcat bash -c "source ./environmentVariables.sh && node_modules/grunt-cli/bin/grunt --gruntfile=node_modules/cdn-deploy/Gruntfile.js --name=videojs-ima3 --number=production"
```
