videojs.plugin('redispatchEnded', function() {
  var player = this;
  player.on("ended", function (evt) {
    window.postMessage(evt, '*');
  });
});