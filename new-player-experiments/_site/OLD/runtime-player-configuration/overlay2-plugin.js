videojs.plugin('overlay2', function() {
  var player = this,
      overlay = document.createElement('p');
  overlay.className = 'overlay2';
  overlay.innerHTML = "Overlay2 plugin";
  player.el().appendChild(overlay);
});
