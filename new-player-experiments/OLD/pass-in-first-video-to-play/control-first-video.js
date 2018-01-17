videojs.registerPlugin('controlFirstVideo', function() {
  var myPlayer = this,
    passedVideoID;
  // This method called when postMessage sends data into the iframe
  function playVideo(evt){
    passedVideoID = evt.data;
    console.log('video id', passedVideoID);
  };
  // Listen for the message, then call controlVideo() method when received
  window.addEventListener("message",playVideo);
});
