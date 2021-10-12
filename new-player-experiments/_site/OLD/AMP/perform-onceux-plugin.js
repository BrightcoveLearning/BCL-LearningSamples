videojs.registerPlugin('lift', function() {
  var myPlayer = this,
    options = {
      "metadataUri": "https://onceux.unicornmedia.com/now/ads/vmap/od/auto/c8860df3-6695-44f7-a405-ed3634148b85/2a501e22-792f-4348-ad6c-3e48020b199a/725cba9b-a821-47af-ba5b-677d115c4dcf/content.once"
    };
  myPlayer.onceux(options);
});
