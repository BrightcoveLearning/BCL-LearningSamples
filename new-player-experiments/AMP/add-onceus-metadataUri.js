videojs.registerPlugin('ampPassOnceux', function() {
  var myPlayer = this,
    encodedVideoQueryParam,
    decodedVideoQueryParam;
  encodedVideoQueryParam = getQuerystring('videoUrl');
  console.log('encodedVideoQueryParam: ', encodedVideoQueryParam);
  decodedVideoQueryParam = decodeURIComponent(encodedVideoQueryParam);
  console.log('decodedVideoQueryParam', decodedVideoQueryParam);

  myPlayer.onceux({
    'metadataUri': '//onceux.unicornmedia.com/now/ads/vmap/od/auto/c8860df3-6695-44f7-a405-ed3634148b85/2a501e22-792f-4348-ad6c-3e48020b199a/725cba9b-a821-47af-ba5b-677d115c4dcf/content.once'
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
