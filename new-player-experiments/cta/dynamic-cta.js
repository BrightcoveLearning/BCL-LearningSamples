videojs.registerPlugin('dynamicCTA', function() {
  var myPlayer = this;

  // Wait for loadstart before accessing mediainfo information
  myPlayer.on('loadstart', function(evt) {

    // +++ Build dynamic anchor tag +++
    var linkText = myPlayer.mediainfo.link.text,
      linkURL = myPlayer.mediainfo.link.url,
      hrefString = '<a href = "' + linkURL + '" target="_blank" rel="noopener noreferrer">' + linkText + '</a>';

    // +++ Inject dynamic HTML into p element +++
    document.getElementById("cta").innerHTML = hrefString;

    // +++ Configure dynamic overlay +++
    myPlayer.overlay({
      overlays: [{
        "align": "bottom",
        "content": "<p style='color:red; background-color: black; font-weight: bold; font-size: 20px'>" + hrefString + "</p>",
        "start": "pause",
        "end": "play"
      }]
    });

    // +++ Configure dynamic endscreen +++
    myPlayer.customEndscreen({
      "content": "<p style='font-weight: bold; font-size: 20px'>" + hrefString + "</p>"
    });

    // +++ Remove overlay after video has ended +++
    myPlayer.on('ended', function() {
      var overlayElement = document.getElementsByClassName('vjs-overlay')[0];
      overlayElement.setAttribute('style', 'display: none;');
    })
  });
});
