videojs.registerPlugin('backForwardButtons', function() {
    var myPlayer = this,
  		  jumpAmount = 5,
        controlBar,
        insertBeforeNode,
  		  newElementBB = document.createElement('div'),
  		  newImageBB = document.createElement('img'),
  		  newElementFB = document.createElement('div'),
  		  newImageFB = document.createElement('img');

  	// Assign id and classes to div for icon
    newElementBB.id = 'backButton';
    newElementFB.id = 'forwardButton';

  	// Assign properties to elements and assign to parents
    newImageBB.setAttribute('src','//learning-services-media.brightcove.com/doc-assets/player-development/samples/back-forward-buttons/back-button.png');
  	newElementBB.appendChild(newImageBB);
    newImageFB.setAttribute('src','//learning-services-media.brightcove.com/doc-assets/player-development/samples/back-forward-buttons/forward-button.png');
  	newElementFB.appendChild(newImageFB);


  // Get controlbar and insert before elements
  // Remember that getElementsByClassName() returns an array
  controlBar = document.getElementsByClassName('vjs-control-bar')[0];
  // Change the class name here to move the icon in the controlBar
  insertBeforeNode = document.getElementsByClassName('vjs-volume-panel vjs-control vjs-volume-panel-horizontal')[0];
  console.log('insertBeforeNode',insertBeforeNode);
  // Insert the icon div in proper location
  controlBar.insertBefore(newElementBB,insertBeforeNode);
  controlBar.insertBefore(newElementFB,insertBeforeNode);

  newElementBB.addEventListener('click',function(){
    window.alert('hello');
  })
});
