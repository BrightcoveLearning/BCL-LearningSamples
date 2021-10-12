videojs.registerPlugin('dynamicEndscreen', function() {
  var myPlayer = this;
  myPlayer.on('loadstart', function() {

    // +++ Retrieve info from mediainfo object +++
    linkURL = myPlayer.mediainfo.link.url;
    linkText = myPlayer.mediainfo.link.text;

    // +++ Build link string for the endscreen content +++
    hrefString = '<a href = "' + linkURL + '" target="_blank" rel="noopener noreferrer">' + linkText + '</a>'

    // +++ Call endscreen method +++
    myPlayer.customEndscreen({
      "content": hrefString
    });
  });
});
