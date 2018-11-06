videojs.registerPlugin('ampPassVideo', function() {
  var myPlayer = this,
    encodedVideoQueryParam,
    decodedVideoQueryParam;

  // Get the query string and un-URL encode it
  encodedVideoQueryParam = getQuerystring('videoUrl');
  decodedVideoQueryParam = decodeURIComponent(encodedVideoQueryParam);

  // Load the video into the player
  myPlayer.src({
    'type': 'video/mp4',
    'src': decodedVideoQueryParam
  });

  // On loadedmetadata event, play the video
  myPlayer.on('loadedmetadata', function(){
    myPlayer.play();
  });

  /*
   * usage: foo = getQuerystring("bctid", null);
   * foo will be equal to value of query param bctid
   * note that the default_ parameter is what you will get back
   * if the key isn’t found
   */
  function getQuerystring(key, default_) {
    var regex, qs;
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return default_;
    } else {
      return qs[1];
    }
  }
});
