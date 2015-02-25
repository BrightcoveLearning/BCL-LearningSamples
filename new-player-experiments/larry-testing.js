videojs.plugin('setupAds', function() {
  'use strict';
  var player = this, 
      currentVideoId = player.el().getAttribute('data-video-id'),
      newServerURL = 'http://pubads.g.doubleclick.net/gampad/ads?sz=320x240&iu=/4236/usweek.channels/video&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&cmsid=1063&vid=' + currentVideoId;
console.log("video id: ", currentVideoId);
console.log("new server URL:", newServerURL);
  player.ima3({
    "serverUrl": newServerURL,
    "prerollTimeout": 5000,
    "adTechOrder": ["flash","html5"]
  });
});