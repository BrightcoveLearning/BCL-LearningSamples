videojs.registerPlugin('displayRelatedLink', function(){
  var myPlayer = this;

  // +++ Wait for loadstart to read video information +++
  myPlayer.on('loadstart', function(evt) {

    // +++ Read test and link from video info and build anchor tag +++
    var linkText = myPlayer.mediainfo.link.text,
      linkURL = myPlayer.mediainfo.link.url,
      hrefString = '<a href = "' + linkURL + '" target="_blank">' + linkText + '</a>';

    // +++ Inject anchor tag into HTML +++
    document.getElementById('linkHere').innerHTML = hrefString;
  });
});
