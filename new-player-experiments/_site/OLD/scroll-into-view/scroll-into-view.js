videojs.registerPlugin('scrollIntoView', function() {
  var myPlayer = this;

  // +++ Execute every time page is scrolled +++
  window.onscroll = checkIfVideoInView;

  // +++ Called on scroll, check if in view and the play/pause +++
  function checkIfVideoInView() {
    if (isScrolledIntoView(myPlayerID)) {
      // the player is fully in the viewport
      myPlayer.play();
    } else {
      // the player is not in the viewport
      myPlayer.pause();
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
});
