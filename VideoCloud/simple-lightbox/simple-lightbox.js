var player,
    APIModules,
    mediaEvent,
    videoPlayer,
    playerLoaded = false,
    // vars for BCMAPI wrapper
    params = {};
    // initialize BCMAPI setup
    BCMAPI.token = "WDGO_XdKqXVJRVGtrNuGLxCYDNoR-SvA5yUqX2eE6KjgefOxRzQilw..";
    BCMAPI.url = "//api.brightcove.com/services/library";
    // note the callback is the public name of the function
    BCMAPI.callback = "onGetVideos";
    params.any = "sea";
    params.video_fields = "id,shortDescription,length,videoStillURL";

  /**** template loaded event handler ****/
  var onTemplateLoad = function(experienceID) {
    // let the video selector know the player is loaded
    playerLoaded = true;
    // get a reference to the player and API Modules and Events
    player = brightcove.api.getExperience(experienceID);
    APIModules = brightcove.api.modules.APIModules;
    mediaEvent = brightcove.api.events.MediaEvent;
    // do the Media API search
    BCMAPI.search(params);
  }
  /**** template ready event handler ****/
  var onTemplateReady = function(evt) {
    // get references to modules
    videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
    // add media COMPLETE listener
    videoPlayer.addEventListener(mediaEvent.COMPLETE, hideAndStop);
  }
  /**** callback for Media API call ****/
  var onGetVideos = function(JSONdata) {
    var formattedLength,
      i,
      max = JSONdata.items.length,
      videosAra = JSONdata.items;
    // convert video length to human-readable format
    for (i = 0; i < max; i++) {
      formattedLength = BCLSsecondsToTime(videosAra[i].length / 1000);
      videosAra[i].length = formattedLength.m + ":" + formattedLength.s;
    }
    for (i = 0; i < max; i++) {
      var newImg = document.createElement("img");
      newImg.alt = videosAra[i].shortDescription;
      newImg.className ="video-list-item";
      newImg.src = videosAra[i].videoStillURL;
      newImg.width = "180";
      newImg.height = "96";
      newImg.setAttribute("data-id", videosAra[i].id);
      videoList.appendChild(newImg);
      newImg.addEventListener("click", showAndLoad);
    }
    document.getElementById("BCLSclose").addEventListener("click", hideAndStop);
 }
 var showAndLoad = function(videoID) {
    // make sure the player is loaded
    if (playerLoaded) {
      // reveal the lightbox
      document.getElementById("BCLSlightbox").className = "BCLSshow";
      // load the video
      videoPlayer.loadVideoByID( this.getAttribute("data-id"));
    }
  }
  var hideAndStop = function() {
    // hide the lightbox
    document.getElementById("BCLSlightbox").className = "BCLShide";
    // pause the video
    videoPlayer.pause(true);
  }
