videojs.plugin('relatedPlaylist', function() {
  var myPlayer = this,
  returnedPlaylist,
  playlistID = 4609649081001,
  htmlElement = '',
  // build a div that will be used as overlay content
  overlayDiv = createEl('div', {
    id: 'bclsOverlay'
  });
  // get the playlist using the catalog
  myPlayer.catalog.getPlaylist(playlistID, function(error, playlist){
    //deal with error
    returnedPlaylist = playlist;
    // be sure no more than 9 videos in playlist
    returnedPlaylist = returnedPlaylist.slice(0,9);
    // call function to use video objects to build div using thumbnails
    htmlElement = createVideoList(returnedPlaylist);
    // append div of thumbnails to overlay element
    overlayDiv.appendChild(htmlElement);
  });
  // use overlay plugin to display related videos on pause and video end
  myPlayer.overlay({
    overlays: [{
      align: 'top',
      content: overlayDiv,
      start: 'pause',
      end: 'play'
    }]
  });

  /**
   * loads and plays a video
   * this function called with thumbnails in
   * the overlay are clicked;
   * must be a function expression or scope
   * would be limited to plugin's function scope
   * and this function used by the HTML page
   * @param {integer} idx the index of the video object in the videoData array
   */
  loadAndPlay = function(idx) {
    myPlayer.catalog.load(returnedPlaylist[idx]);
    myPlayer.play();
  }

  /**
   * create an element
   *
   * @param  {string} type - the element type
   * @param  {object} attributes - attributes to add to the element
   * @return {HTMLElement} the HTML element
   */
  function createEl(type, attributes) {
    var el,
      attr;
    el = document.createElement(type);
    if (attributes !== null) {
      for (attr in attributes) {
        el.setAttribute(attr, attributes[attr]);
      }
      return el;
    }
  }

  /**
   * create the html for the overlay
   *
   * @param {array} videoData array of video objects
   * @return {HTMLElement} videoList the div element containing the overlay
   */
  function createVideoList(videoData) {
    var i,
      iMax = videoData.length,
      videoList = createEl('div', {
        id: 'videoList'
      }),
      videoHeader = createEl('h1', {
        style: 'color:#666600;font-size: 2em;margin-bottom:.5em'
      }),
      videoWrapper = createEl('div'),
      thumbnailLink,
      thumbnailImage;
    videoList.appendChild(videoWrapper);
    for (i = 0; i < iMax; i++) {
      thumbnailLink = createEl('a', {
        href: 'javascript:loadAndPlay(' + i + ')'
      })
      thumbnailImage = createEl('img', {
        class: 'video-thumbnail',
        src: videoData[i].thumbnail
      });
      videoWrapper.appendChild(thumbnailLink);
      thumbnailLink.appendChild(thumbnailImage);
    }
    return videoList;
  }
});
