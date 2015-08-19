var VAST = require('vast-xml');

var vast = new VAST({VASTErrorURI: 'http://solutions.brightcove.com/bcls/assets/images/Tiger-4-preview.jpg'});
var theXML = vast.xml({ pretty : true, indent : '  ', newline : '\n' });
console.log(theXML);