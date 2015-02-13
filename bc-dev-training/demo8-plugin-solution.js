videojs.plugin('pluginDev', function() {
  var player = this,
  overlay = document.createElement('p');
  overlay.className = 'vjs-overlay';
  overlay.innerHTML = "Becoming a plugin developer";
  player.el().appendChild(overlay);
});