videojs.registerPlugin('liveCustomError', function() {
  var myPlayer = this;
  
  // +++ Create a div in which to place HTML content and place image inside +++
  var newElement = document.createElement('div');
  newElement.innerHTML = "<img src='//solutions.brightcove.com/bcls/assets/images/please-stand-by.png'>";

  // +++ Define options object to be used for modal content +++
  var options = {};
  options.content = newElement;

  // +++ Create Modal with options object +++
  var ModalDialog = videojs.getComponent('ModalDialog');
  var myModal = new ModalDialog(myPlayer, options);
  myPlayer.addChild(myModal);

  // +++Listen for an error event  +++
  myPlayer.on('error', function(err) {
    // The Modal should only be displayed if the error code is 4
    // and the duration is NaN (not a number)
    // The following code gets the error code and duration
    var errNo = myPlayer.error().code;
    var duration = myPlayer.duration();

    // +++ Check if the error code and duration mean no video has loaded +++
    if ((errNo == '4') && (isNaN(duration))) {
      // Hide the error display
      myPlayer.errorDisplay.hide();
      // If conditions met show the custom modal
      myModal.open();
    }
  });

  // +++ If custom modal error closed, show the default error +++
  myModal.on('modalclose', function() {
    myPlayer.errorDisplay.show();
  });

});
