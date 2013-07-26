(function(window) {
  var image = document.getElementById("cta");
  var clickThru = document.getElementById("ctaLink");
  //event listener for template loaded
  onTemplateLoaded = function(experienceID) {
    log("template loaded");
    player = brightcove.api.getExperience(experienceID);
  }
  // event listener for the player being ready
  onTemplateReady = function(event) {
    log("template ready");
    // get a reference to the video player and add listener for media complete
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    // get the long description and parse it
    videoPlayer.getCurrentVideo(function(videoDTO) {
      imageData = JSON.parse(videoDTO.longDescription);
      log(imageData);
    })
    // get a reference to the cue points module and set a listener
    cuePointsModule = player.getModule(brightcove.api.modules.APIModules.CUE_POINTS);
    cuePointsModule.addEventListener(brightcove.api.events.CuePointEvent.CUE, onCuePoint);
   };
  // Cue points handler
  onCuePoint = function(event) {
    log("cue point");
    if (event.cuePoint.name === "ctaStart") {
      clickThru.setAttribute("href", imageData.linkURL);
      image.setAttribute("src", imageData.imageURL);
      image.setAttribute("class", "opaque");
      image.setAttribute("style", "top:" + imageData.top + ";" + "left:" + imageData.left);
      image.src = imageData.imageURL;
      image.className = "opaque";
      image.style = "top:" + imageData.top + ";" + "left:" + imageData.left;
    }
    else if (event.cuePoint.name === "ctaEnd") {
      image.setAttribute("class", "transparent");
      image.className = "transparent";
    }
  };
  // debugging tool - wraps console.log to avoid errors in IE 7 & 8
  log = function(message) {
    if (window["console"] && console["log"]) {
      var d = new Date();
      console.log(d + ": ");
      console.log(message);
    };
  };
})(window);