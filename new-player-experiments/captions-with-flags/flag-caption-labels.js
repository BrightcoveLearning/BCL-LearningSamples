videojs.registerPlugin('flagCaptionLabels', function() {
  var myPlayer = this;
  myPlayer.on('loadedmetadata',function(){
    var textItems = myPlayer.$$('.vjs-menu-item-text'),
      englishItemIndex,
      germanItemIndex,
      englishItem,
      germanItem;
    englishItemIndex = findObjectInArray(textItems,'innerText','English');
    germanItemIndex = findObjectInArray(textItems,'innerText','German');
    englishItem = textItems[englishItemIndex];
    germanItem = textItems[germanItemIndex];
    englishItem.innerHTML = '🇺🇸'+ ' English';
    germanItem.innerHTML = '🇩🇪'+ ' German';
  });

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
