  // Create array for player IDs
  var players = [];

  // +++  Determine the available player IDs +++//
  for (x = 0; x < Object.keys(videojs.players).length; x++) {
    // Assign the player name to setPlayer
    var setPlayer = Object.keys(videojs.players)[x];
    // Define the ready event for the player
    videojs(setPlayer).ready(function() {
      // Assign this player to a variable
      myPlayer = this;
      // Assign and event listener for play event
      myPlayer.on("play", onPlay);
      // Push the player to the players array
      players.push(myPlayer);
    });
  }

  // +++ Handle all players' play event +++//
  function onPlay(e) {
    // Determine which player the event is coming from
    var id = e.target.id;
    // Loop through the array of players
    for (var i = 0; i < players.length; i++) {
      // Get the player(s) that did not trigger the play event
      if (players[i].id() != id) {
        // Pause the other player(s)
        videojs(players[i].id()).pause();
      }
    }
  }
