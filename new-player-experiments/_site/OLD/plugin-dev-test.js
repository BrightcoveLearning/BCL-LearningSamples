videojs.plugin('pluginDevTest', function() {
  var player = this,
  overlay = document.createElement('p');
  overlay.className = 'vjs-overlay';
  overlay.innerHTML = "First Plugin Working!";
  player.el().appendChild(overlay);
});