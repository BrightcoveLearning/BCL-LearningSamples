(function() {

	function onPlayerReady() {
    //creates a variable (overlay) and div for the overlay to occur in
		overlay = videoPlayer.overlay();

    //create an event listener for the video being played
		videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, mediaBeginHandler);
    //create an event listener for the video being stopped
		videoPlayer.addEventListener(brightcove.api.events.MediaEvent.STOP, mediaStopHandler);
	}

  //function signifying the action of clicking on the overlay
	function onScrollClicked(pEvent) {
		window.open('http://www.brightcove.com/', '_newtab');
    }

  //function signifying the action of the video being played    
	function mediaBeginHandler(pEvent) {
        //setTimeout executes the drawCanvas function once
        setTimeout(function drawCanvas(){
        //the Scroll variable specifies the dimensions of the overlay 
           Scroll = document.createElement('canvas');
           Scroll.height = 30;
           Scroll.width = 480;
        //the css styling specifies the position of the overlay
           $(Scroll).css({
              position: 'absolute',
              top: '10px',
           });
        //the context specifies the properties of the overlay (see the more advanced example for additional properties)
           context = Scroll.getContext('2d');
           context.fillStyle = "White"
           context.font = "18pt Segoe UI";

        //*Replace statement with your desired text overlay*
           var text = '*Replace statement with your desired text overlay*'

        //creates a variable named metrics to measure the text content in the overlay
           var metrics = context.measureText(text);

        //create variables used for the scrolling
           currentX = Scroll.width;
        //clearInterval resets the marquee variable to ensure the scrolling is not too fast
           clearInterval(marquee);
           marquee = setInterval(function() {
              context.clearRect( 0, 0, 480, 30 );
              context.fillText( text, currentX, Scroll.height - 10 );
        //currentX denotes the current value of the text within the canvas      
              currentX -= 2;
        //resets the marquee
              if( currentX + metrics.width < 0 ) {
                 currentX = 600;
              }
           }, 20 );
        //in order to make the text scroll faster or slower, you can change the number in the line above
        //this number signifies how many milliseconds to wait before moving the marquee over
        //(faster is a lower number, slower is a higher number)
         
           $(Scroll).click(onScrollClicked);
           overlay.appendChild(Scroll);
        },1);
    }

  //function signifying the action of the video being stopped
     function mediaStopHandler(pEvent) {
      //erases the current overlay when video is stopped
        overlay.removeChild(Scroll);
    }   

    player = brightcove.api.getExperience();
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    experience = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    var overlay,Scroll,marquee;

    if (experience.getReady()) {
        onPlayerReady();
    } else {
        experience.addEventListener(brightcove.player.events.ExperienceEvent.TEMPLATE_READY, onPlayerReady);
    }
	}());