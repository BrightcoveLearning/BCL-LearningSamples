videojs.registerPlugin('detect_ad_blocker', function () {
  var myPlayer = this;
  myPlayer.usingAdBlocker().then(
    hasBlocker => {
      if (hasBlocker) { 
        console.log('adding ad blocker check');
        var newP = document.createElement("p");
        newP = '<aside class="bcls-aside bcls-aside--warning language-editable">These ads will not play as you are using an ad blocker.</aside>';
        document.getElementById("ad-blocker-note").insertAdjacentHTML('afterbegin', newP);
       }
    });
});