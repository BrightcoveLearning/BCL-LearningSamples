videojs.registerPlugin('displayDuration', function() {
  const myPlayer = this;
  myPlayer.on('loadstart', function () {
    let timeInSeconds = Math.round(myPlayer.mediainfo.duration),
      timeInMinutesSeconds = fmtMSS(timeInSeconds);

    myPlayer.overlay({
      overlays: [{
        align: 'bottom-left',
        content: 'Duration (min:sec): ' + timeInMinutesSeconds,
        start: 'loadeddata',
        end: 'play'
      }]
    });
  });

  function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s };
});