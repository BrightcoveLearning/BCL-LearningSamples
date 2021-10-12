videojs.plugin('manualRenditionSelectionHLS', function() {
  var player = this,
    changeQuality,
    createSelectInControlbar;

    player.on('loadedmetadata', function () {
      var selectControl;

      // display quality select element in controlbar
      createSelectInControlbar();

      // get select element and add change event listener
      selectControl = document.getElementById('selectID');
      selectControl.addEventListener('change',changeQuality);
    });

  // function that adds the HTML select element to the controlbar
  function createSelectInControlbar() {
    var newElement = document.createElement('div'),
      // dynamically build the select element
      selectControl = document.createElement('select'),
      option;
    // dynamically configure the select element and add options
    newElement.id = 'selectID';
    newElement.name = 'quality';
    newElement.className = 'selectStyle vjs-control';
    option = document.createElement('option');
    option.text = 'Quality';
    selectControl.appendChild(option);
    option = document.createElement('option');
    option.value = 'low';
    option.text = 'Low';
    selectControl.appendChild(option);
    option = document.createElement('option');
    option.value = 'high';
    option.text = 'High';
    selectControl.appendChild(option);
    newElement.appendChild(selectControl);
    // get spacer in controlbar and append select element
    spacer = document.getElementsByClassName('vjs-spacer')[0];
    spacer.setAttribute("style", "justify-content: flex-end;");
    spacer.appendChild(newElement);
  };

  // function that changes rendition quality
  function changeQuality(evt) {
    var selectedQuality,
      setToTrueSet,
      lengthOfReps = player.hls.representations().length,
      theSelect = evt.target,
      sortedArray = player.hls.representations(),
      highBandwidths,
      lowBandwidths,
      enableBandwidths;
    // sort copy of reps array
    sortedArray.sort(function(a,b){
      if (a.bandwidth > b.bandwidth) {
          return 1;
        }
        if (a.bandwidth < b.bandwidth) {
          return -1;
        }
        // a must be equal to b
        return 0;
    });
    // for high and low quality getting the top 2 and bottom 2 renditions by bandwidth
    // put both the bottom 2 and top 2 bandwidths in separate arrays
    if (lengthOfReps > 2){
      lowBandwidths = [sortedArray[0].bandwidth, sortedArray[1].bandwidth];
      highBandwidths = [sortedArray[lengthOfReps - 2].bandwidth, sortedArray[lengthOfReps - 1].bandwidth];
      // get selected quality from HTML select element
      selectedQuality = theSelect.options[theSelect.selectedIndex].value;
      // set either the bottom or top bandwidth array to the desired quality
      if (selectedQuality === 'low') {
        enabledBandwidths = lowBandwidths;
      } else {
        enabledBandwidths = highBandwidths;
      }
      // loop over each rep and check if it should be enabled
      // if a rep's bandwidth is in the enabled bandwidth array (indexOf is not -1)
      // set enabled to true, otherwise set enabled to false
      player.hls.representations().forEach(function (rep) {
        if (enabledBandwidths.indexOf(rep.bandwidth) !== -1) {
          rep.enabled(true);
        } else {
          rep.enabled(false);
        }
      });
    };
 };
});
