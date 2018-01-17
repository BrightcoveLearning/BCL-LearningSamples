videojs.registerPlugin('scrollIntoView', function() {
  var myPlayer = this,
    isAdPlaying = false;

  function isScrolledIntoView(elem) {
    // get the position of the viewport
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    // get the position of the player element
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    // determine if the player element is in fully in the viewport
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) &&
      (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  };

  function checkIfVideoInView() {
    // check if we are in ad or content playback
    //  and get reference to the relevant player
    var currentPlayer = !isAdPlaying ? myPlayer : myPlayer.ima3.adPlayer;
    if (isScrolledIntoView(myPlayer.el())) {
      // the player is fully in the viewport
      currentPlayer.play();
      // ensure the conent player is paused
      if (isAdPlaying) {
        myPlayer.pause();
      }
    } else {
      // the player is not in the viewport
      currentPlayer.pause();
    }
  };

  window.onscroll = checkIfVideoInView;

  myPlayer.on(['ads-ad-started', 'ads-ad-ended', 'ima3-complete', 'ads-ad-skipped', 'adserror', 'ads-allpods-completed'], function (evtObject) {
    if (evtObject.type == 'ads-ad-started') {
      isAdPlaying = true;
    } else {
      isAdPlaying = false;
    }
  });
});
