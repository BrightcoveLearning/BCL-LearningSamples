videojs.registerPlugin('lift', function () {
  var myPlayer = this,
    options = {},
    encodedVideoQueryParam,
    decodedVideoQueryParam;
  // Retrieve the query string from Brightcove Player src attribute in the iframe
  encodedVideoQueryParam = getQuerystring('videoUrl');
  // Remove the URLenceded formatting
  decodedVideoQueryParam = decodeURIComponent(encodedVideoQueryParam);
  // Create an options object to pass to the Once UX plugin
  options = {
    "metadataUri": decodedVideoQueryParam
  };
  // Call the Once UX plugin passing the options object
  myPlayer.onceux(options);

  // Helper function to get value from specified query parameter
  /*
   * usage: foo = getQuerystring("bctid", null);
   * foo will be equal to value of query param bctid
   * note that the default_ parameter is what you will get back
   * if the key isnâ€™t found
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
