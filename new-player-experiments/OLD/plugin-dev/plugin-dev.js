videojs.plugin('pluginDev', function(options) {
  var player = this,
  overlay = document.createElement('p');
  overlay.className = 'vjs-overlay';
  overlay.innerHTML = options.overlayText;
  player.el().appendChild(overlay);
});