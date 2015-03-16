videojs.plugin('downloadVideoPlugin', function() {
  var myPlayer = this,
    videoID,
    videoName,
    totalRenditions,
    mp4Ara=[],
    highestQuality,
    downloadString,
    overlay;
  videoID = myPlayer.options()['data-video-id'];
  myPlayer.catalog.getVideo(videoID, function(error, video) {
    myPlayer.catalog.load(video);
    videoName = myPlayer.mediainfo['name'];
console.log(myPlayer.mediainfo);    
    rendtionsAra = myPlayer.mediainfo.sources;
    totalRenditions = rendtionsAra.length;
    for (var i = 0; i < totalRenditions; i++) {
      if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
        mp4Ara.push(rendtionsAra[i]);
      };
    };
    mp4Ara.sort( function (a,b){
      return b.size - a.size;
    });
    highestQuality= mp4Ara[0].src;
    downloadString = "<a href='" + highestQuality + "' download='" + videoName + "'>Download the Video</a>";
    overlay = document.createElement('p');
    overlay.innerHTML = downloadString;
    overlay.className = 'download-overlay';
    myPlayer.el().appendChild(overlay);
    var elements = document.getElementsByClassName('vjs-fullscreen-control');
    console.log(elements);
  });
});