videojs.registerPlugin('detect_ad_blocker', function () {
  var myPlayer = this;
  myPlayer.usingAdBlocker().then(
    hasBlocker => {
      if (hasBlocker) { 
        console.log('adding ad blocker check');
        var newP = document.createElement("p");
        newP = '<aside class="bcls-aside bcls-aside--warning language-editable">These ads will not play as you are using an ad blocker. <a href="https://ssai.support.brightcove.com/vod/guides/ssai-ad-block-detection-and-auto-failover.html">Learn more about using SSAI (server-side ad insertion) fallback</a> when a client side ad blocker is present.</aside>';
        document.getElementById("ad-blocker-note").insertAdjacentHTML('afterbegin', newP);
       }
    });
});