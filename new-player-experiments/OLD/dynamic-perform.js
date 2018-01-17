videojs.plugin('listenForchange', function() {
  var myPlayer = this,
     changeVideoFunc = function(evt){
      if(evt.data.command === "changeVideo"){
        myPlayer.src(evt.data.videoURL);  
        myPlayer.play();
      };
  };
 window.addEventListener("message",changeVideoFunc);
});