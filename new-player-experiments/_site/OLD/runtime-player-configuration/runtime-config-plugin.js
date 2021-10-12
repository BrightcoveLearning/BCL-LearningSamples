/**
* Dynamic Code Plugin
* Adapted from
* https://github.com/brightcove/videojs-debugger/blob/d9380572dab701130e6b44a055f9dffb6e70f516/src/js/bootstrap.js#L77
*/
videojs.plugin('dynamicCode', function(options) {
  'use strict';
  var player = this,
  loaded,
  script,
  stylesheet;

  // dynamically create a script element to fetch the additional javascript
  script = document.createElement('script'),

  // you can do the same trick with stylesheets, too
  stylesheet = document.createElement('link'),
  // make sure that the load handler is only invoked once
  loaded = false;

  // setup an onload handler to initialize the plugin once the runtime
  // resources are downloaded
  script.onload = script.onreadystatechange = function() {
    if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      loaded = true;
      script.onload = script.onreadystatechange = null;

      // initialize the plugin now that the additional javascript is
      // loaded and ready
      player.dynamicCode.init();
    }
  };

  // provide an absolute URL to the extra script
  // use a protocol-relateive URL if possible so your plugin works in
  // HTTPS pages
  script.src = options.scriptURL;

  stylesheet.rel = "stylesheet";
  // provide an absolute URL to any stylesheet resources you need
  stylesheet.href = options.stylesheetURL;

  document.body.appendChild(script);
  document.body.appendChild(stylesheet);

  // initialize the plugin once all the external resources have finished loading
  player.dynamicCode.init = function() {
    player.overlay2();
  };
});
