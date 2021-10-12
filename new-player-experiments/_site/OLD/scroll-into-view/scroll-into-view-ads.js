videojs.registerPlugin('scrollIntoViewAds', function() {
  var myPlayer = this,
    isAdPlaying = false;

  // +++ Configure IMA3 plugin +++
  myPlayer.ima3({
    // only use HTML5 mode
    adTechOrder: ["html5"],
    // you can increase or decrease the max amount of time to wait for an ad
    timeout: 5000,
    // this is where your ad tag goes
    serverUrl: "//solutions.brightcove.com/bcls/brightcove-player/vmap/simple-vmap.xml"
  });

  // +++ Execute every time page is scrolled +++
  window.onscroll = checkIfVideoInView;

  // +++ Called on scroll, check if in view and the play/pause +++
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

  // +++ Checks if player is in view +++
  function isScrolledIntoView(elem) {
    // Get the position of the viewport
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    // get the position of the player element
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    // Determine if the player element is in fully in the viewport
    return (
      elemBottom >= docViewTop &&
      elemTop <= docViewBottom &&
      elemBottom <= docViewBottom &&
      elemTop >= docViewTop
    );
  };

  // +++ Set Boolean value for if ad is playing +++
  myPlayer.on(
    [
      'ads-ad-started',
      'ads-ad-ended',
      'ima3-complete',
      'ads-ad-skipped',
      'adserror',
      'ads-allpods-completed'],
    function(evtObject) {
      if (evtObject.type == 'ads-ad-started') {
        isAdPlaying = true;
      } else {
        isAdPlaying = false;
      }
  });

});
