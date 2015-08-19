/**
 * Plugin to play mutliple videos
 */
videojs.plugin('multipleVideo', function() {
  var myPlayer = this,
  eVideoName = document.getElementById("videoName"),
  eTimeRemaining = document.getElementById("timeRemaining"),
  timeRemaining,
  totalTime,
  currentVideoIndex = 0,
  firstVideo = true,
  playlistData = [
    {
    "name":"Tiger", 
    "thumbnailURL":"//solutions.brightcove.com/bcls/assets/images/Tiger.jpg",
    "sources":[
      {
      "type":"application/x-mpegURL",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/Tiger.m3u8"
      },
      {
      "type":"video/mp4",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/Tiger.mp4"
      }
        ]
    },
    {
    "name":"Great Blue Heron", 
    "thumbnailURL":"//solutions.brightcove.com/bcls/assets/images/Great-Blue-Heron.png",
    "sources":[
      {
      "type":"application/x-mpegURL",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/Great-Blue-Heron.m3u8"
      },
      {
      "type":"video/mp4",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/Great-Blue-Heron.mp4"
      }
        ] 
    },
    {
    "name":"Birds of a Feather", 
    "thumbnailURL":"http://solutions.brightcove.com/bcls/assets/images/BirdsOfAFeather.png",
    "sources":[
      {
      "type":"video/mp4",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/BirdsOfAFeather.mp4"
      }
        ] 
    },
    {
    "name":"Sea Marvels", 
    "thumbnailURL":"http://solutions.brightcove.com/bcls/assets/images/Sea Marvels.png",
    "sources":[
      {
      "type":"video/mp4",
      "src":"http://solutions.brightcove.com/bcls/assets/videos/Sea-Marvels.mp4"
      }
        ] 
    }
  ];
  
  function loadVideo () {
console.log('in load video');
      if (currentVideoIndex < playlistData.length) {
          // load the new video
          myPlayer.src(playlistData[currentVideoIndex].sources);
          // update the video title display
          eVideoName.innerHTML = "Now playing: <strong>" + playlistData[currentVideoIndex].name + "</strong>";
          // increment the current video index
          currentVideoIndex++;
          // play the video
          if(firstVideo) {
              firstVideo = false;
          } else {
              myPlayer.play();  
          }
      }
  };
  
  myPlayer.on("ended", function () {
      loadVideo();
  });
  myPlayer.on("timeupdate", function (evt) {
      timeRemaining = Math.round(myPlayer.duration() - myPlayer.currentTime());
      totalTime = BCLSsecondsToTime(timeRemaining);
      eTimeRemaining.innerHTML = "Time remaining = " + totalTime.m + ':' +totalTime.s;
  });
  
  // load the first video
  myPlayer.on('loadedmetadata',loadVideo);
  
});