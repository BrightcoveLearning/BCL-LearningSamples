videojs.plugin('overlay1', function() {
  var player = this,
    overlay = document.createElement('p');
  overlay.className = 'overlay1';
  overlay.innerHTML = "Overlay1 plugin";
  player.el().appendChild(overlay);
});
