videojs.plugin('dynamicLoad', function () {
  var myPlayer = this,
    videoType = getURLparam('videoType'),
    videoURL = getURLparam('videoURL');

  myPlayer.src([
    { 
      'type': videoType, 
      'src': videoURL 
    }
  ]);

  myPlayer.play();

  function getURLparam(name) {
    var regex,
      results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };
});