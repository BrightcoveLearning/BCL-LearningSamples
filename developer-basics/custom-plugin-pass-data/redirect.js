videojs.registerPlugin('navigateOnVideoEnd', function (options) {
  var myPlayer = this;
  myPlayer.on('ended', function () {
    window.location.href = options.redirectURL;
  });
});
