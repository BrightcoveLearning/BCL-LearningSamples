videojs.plugin('firstPlugin', function() {
  var player = this,
  overlay = document.createElement('p');
  overlay.className = 'vjs-overlay';
  overlay.innerHTML = "NEW TEXT!";
  player.el().appendChild(overlay);
});
