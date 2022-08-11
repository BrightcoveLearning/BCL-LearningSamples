videojs.registerPlugin('detect_ad_blocker', function () {
  var myPlayer = this;
  myPlayer.usingAdBlocker().then(
    hasBlocker => {
      if (hasBlocker) { alert('You have an ad blocker enabled, which ruins this demonstration'); }
    });
});