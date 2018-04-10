videojs.plugin('downloadVideoPlugin', function() {
  var myPlayer = this,
  videoID,
  videoName,
  totalRenditions,
  mp4Ara = [],
  highestQuality,
  controlBar,
  newElement = document.createElement('div'),
  newLink = document.createElement('a'),
  newImage = document.createElement('img');
  myPlayer.on('loadstart',function(){
    // Extract name for use in download URL
    videoName = myPlayer.mediainfo['name'];
    // Assign renditions to a variable and find number of renditions
    rendtionsAra = myPlayer.mediainfo.sources;
    totalRenditions = rendtionsAra.length;
    // Get only MP4 rendtions into new array
    for (var i = 0; i < totalRenditions; i++) {
      if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
        mp4Ara.push(rendtionsAra[i]);
      };
    };
    // Sort MP4 array
    mp4Ara.sort(function (a, b) {
      return b.size - a.size;
    });
    // Assign largest rendition to a variable for use in URL
    highestQuality = mp4Ara[0].src;
    // Assign id to div for icon
    newElement.id = 'downloadButton';
    // Assign properties to elements and assign to parents
    newImage.setAttribute('src', 'http://solutions.brightcove.com/bcls/brightcove-player/download-video/file-download.png');
    newLink.setAttribute('href', highestQuality + " download=" + videoName);
    newLink.appendChild(newImage);
    newElement.appendChild(newLink);
    // Get control bar and insert before elements
    // Remember that getElementsByClassName() returns an array
    controlBar = document.getElementsByClassName('vjs-control-bar')[0];
    // Insert the icon div in proper location
    controlBar.appendChild(newElement);
  });
});
