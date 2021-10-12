videojs.registerPlugin('passwordToView', function() {
  var myPlayer = this,
    passwordToMatch = '',
    myModal,
    options = {},
    formButton,
    passwordInput,
    // Create div which will hold content for ModalDialog
    newElement = document.createElement('div'),
    // Get a ModalDialog object
    ModalDialog = videojs.getComponent('ModalDialog');
  myPlayer.muted(true);

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

      // Create content for ModalDialog
      newElement.innerHTML = '<div><img class="bcls-image" src="//learning-services-media.brightcove.com/doc-assets/player-development/samples/password/lock-icon.png"><br><input class="theForm" type="password" id="passwordInputID"><br><input id="formButtonID" class="theForm" type="submit" value="Sign In"></div>';

      // Be sure user cannot close ModalDialog, set content
      options.uncloseable = true;
      options.content = newElement;

      // Create a specific ModalDialog and display it
      myModal = new ModalDialog(myPlayer, options);
      myPlayer.addChild(myModal);
      myModal.open();

      // +++ Add event listeners to check password +++
      // Add an event listener to the button
      formButton = newElement.querySelector('#formButtonID');
      myPlayer.on(formButton, 'click', closeModal);

      // Add event listener if user presses Enter key after entering password
      passwordInput = newElement.querySelector('#passwordInputID');
      myPlayer.on(passwordInput, 'keydown', function(event) {
        if (event.keyCode === 13) {
          closeModal();
        }
      });
    }
  })

  // +++ Check entered password against saved password and act accordingly +++
  function closeModal() {
    var userInputPassword = document.getElementById('passwordInputID').value;
    // If passwords match close ModalDialog and play video
    if (userInputPassword == passwordToMatch) {
      myModal.close();
      myPlayer.play();
      // If passwords do not match display dialog indicating so
    } else {
      window.alert('Sorry, password is incorrect. Try again.')
    }
  }
});
