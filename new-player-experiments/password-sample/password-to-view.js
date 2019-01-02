videojs.registerPlugin('passwordToView', function() {
  var myPlayer = this,
    passwordToMatch = '',
    options = {},
    myModal,
    userInputPassword = '',
    // +++ Create variables to hold objects for later use +++
    // Create div which will hold content for ModalDialog
    newElement = document.createElement('div'),
    // Get a ModalDialog object
    ModalDialog = videojs.getComponent('ModalDialog');

  myPlayer.muted(true);

  // +++ Check entered password against saved password and act accordingly +++
  function closeModal() {
    userInputPassword = document.getElementById('inputPassword').value;
    // If passwords match close ModalDialog and play video
    if (userInputPassword == passwordToMatch) {
      myModal.close();
      myPlayer.play();
      // If passwords do not match display dialog indicating so
    } else {
      window.alert('Sorry, password is incorrect. Try again.')
    }
  }

  // +++ Display ModalDialog if password in video's custom field +++
  // Wait for loadstart so password can be read from custom field
  myPlayer.one('loadstart', function() {
    passwordToMatch = myPlayer.mediainfo.customFields['password'];

    // If there is no password, play video
    if (passwordToMatch === undefined) {
      myPlayer.play();
      // If there is a password, build content and display ModalDialog
    } else {
      //Create a div in which to place HTML content
      newElement.setAttribute("style", "display:flex;justify-content:center;align-items:center;");

      // Creeate content for ModalDialog
      newElement.innerHTML = '<div><img class="bcls-image" src="//learning-services-media.brightcove.com/doc-assets/player-development/samples/password/lock-icon.png"><br><input class="theForm" type="password" id="inputPassword"  minlength="8" required><br><input class="theForm" type="submit" value="Sign in" onclick="closeModal()"></div>';

      // Be sure user cannot close ModalDialog, set content
      options.uncloseable = true;
      options.content = newElement;
      // Create a specific ModalDialog and display it
      myModal = new ModalDialog(myPlayer, options);
      myPlayer.addChild(myModal);
      myModal.open();
    }
  })

});
