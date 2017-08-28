videojs.registerPlugin('listenForParent', function() {
  var myPlayer = this,
   // This method called when postMessage sends data into the iframe
  controlVideo = function(evt){
      if(evt.data === "playVideo") {
        myPlayer.play();
      } else if (evt.data === 'pauseVideo') {
        myPlayer.pause();
      }
  };
  // Listen for the message, then call controlVideo() method when received
  window.addEventListener("message",controlVideo);
});
