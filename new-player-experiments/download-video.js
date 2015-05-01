videojs.plugin('downloadVideoPlugin', function() {
  var myPlayer = this,
    videoID,
    videoName,
    totalRenditions,
    mp4Ara=[],
    highestQuality,
    controlBar,
    newElement;
  videoID = myPlayer.options()['data-video-id'];
  myPlayer.catalog.getVideo(videoID, function(error, video) {
    myPlayer.catalog.load(video);
    videoName = myPlayer.mediainfo['name'];
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
    newElement = document.createElement('div');
    newElement.style['padding-right'] = '5px';
    newElement.style['margin-top'] = '18px';
    newElement.style['order'] = 9;  
    newElement.innerHTML = "<a href='" + highestQuality + "' download='" + videoName + "'><img src='http://solutions.brightcove.com/bcls/brightcove-player/download-video/file-download.png' /></a>";
    controlBar = document.getElementsByClassName('vjs-control-bar');
    controlBar[0].appendChild(newElement);
  });
});