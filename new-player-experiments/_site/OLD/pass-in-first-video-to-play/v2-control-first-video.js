videojs.registerPlugin('controlFirstVideo', function() {
  var myPlayer = this,
    passedVideoID,
    wantedVideoIndex;

  // This method called when postMessage sends data into the iframe
  function playVideo(evt) {
    // Retrieve data stored in the object passed via postMessage
    passedVideoID = evt.data;
    // Retrieve desired video object using Video Cloud catalog
    wantedVideoIndex = findObjectInArray(myPlayer.playlist(),'id',passedVideoID);
    console.log('location of wanted video:', wantedVideoIndex);
    myPlayer.playlist.currentItem(wantedVideoIndex);
  };
  // Listen for the message, then call playVideo() method when received
  console.log('1038');
  window.addEventListener("message", playVideo);

  /**
   * find index of an object in array of objects
   * based on some property value
   *
   * @param {array} targetArray array to search
   * @param {string} objProperty object property to search
   * @param {string} value of the property to search for
   * @return {integer} index of first instance if found, otherwise returns -1
  */
  function findObjectInArray(targetArray, objProperty, value) {
      var i, totalItems = targetArray.length, objFound = false;
      for (i = 0; i < totalItems; i++) {
          if (targetArray[i][objProperty] === value) {
              objFound = true;
              return i;
          }
      }
      if (objFound === false) {
          return -1;
      }
  }
});
