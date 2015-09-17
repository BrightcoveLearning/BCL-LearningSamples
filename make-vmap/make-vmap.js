var VAST = require('vast-xml');

var vast = new VAST();

var ad = vast.attachAd({
      id : 1
    , structure : 'inline'
    , sequence : 99
    , Error: 'http://error.err'
    , Extensions: ['<xml>data</xml>'] // accepts an array or string of XML, warning: XML is not validated by this library!
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  });

var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , Duration : '00:00:8'
});

creative.attachMediaFile('http://solutions.brightcove.com/bcls/ads/bc-ads/bcls-ad-6-5seconds.mp4', {
    id : 2
  , type: "video/mp4"
  , bitrate: "4316"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "1280"
  , height: "720"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: ""
});

var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , skipoffset: '00:00:05'
  , Duration : '00:00:12'
});

creative.attachMediaFile('http://solutions.brightcove.com/bcls/ads/bc-ads/bcls-ad-4-12seconds.mp4', {
    id : 3
  , type: "video/mp4"
  , bitrate: "3026"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "1280"
  , height: "720"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: ""
});

var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , Duration : '00:00:08'
});

creative.attachMediaFile('http://solutions.brightcove.com/bcls/ads/bc-ads/bcls-ad-1-8seconds.mp4', {
    id : 4
  , type: "video/mp4"
  , bitrate: "2115"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "1280"
  , height: "720"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: ""
});

var theXML = vast.xml({ pretty : true, indent : '  ', newline : '\n' });

console.log(theXML);