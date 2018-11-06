videojs.registerPlugin('lift', function() {
  var myPlayer = this,
  options = {},
  encodedVideoQueryParam,
  decodedVideoQueryParam;
  encodedVideoQueryParam = getQuerystring('videoUrl');
  console.log('413');
  console.log('encodedVideoQueryParam: ', encodedVideoQueryParam);
  decodedVideoQueryParam = decodeURIComponent(encodedVideoQueryParam);
  console.log('decodedVideoQueryParam', decodedVideoQueryParam);
    options = {
      "metadataUri": decodedVideoQueryParam
    };
  console.log('options', options);
  myPlayer.onceux(options);

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
