videojs.registerPlugin('unmuteButton', function() {
  var myPlayer = this,
    volumeLevel = .5;

  // +++ Check if in Safari or on iOS +++
  if (videojs.browser.IS_IOS || videojs.browser.IS_SAFARI) {
    // If true, go with the unmute button
    var button = document.createElement("button");

    // +++ Add button's event listener +++
    button.addEventListener("click", function() {
      myPlayer.muted(false);
      myPlayer.volume(volumeLevel);
      playerContainer.removeChild(button);
    });

    // +++ Configure the button +++
    button.textContent = "Unmute";
    button.classList.add('inner');
    button.setAttribute("style", "color:black; background-color:red; width:100px; height:50px; opacity: .4;");

    // +++ Add the button to the container +++
    playerContainer.appendChild(button);
  } else {
    // +++ If not iOS or Safari start the audio +++
    myPlayer.on('loadstart', function(){
      myPlayer.muted(false);
      myPlayer.volume(volumeLevel);
    });
  }
});
