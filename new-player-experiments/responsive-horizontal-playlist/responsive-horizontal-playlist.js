/**
 * Plugin to manage a custom playlist
 */
 /**
  * Brightcove player plugin that displays a playlist
  * as a row of thumbnail images along the bottom of the
  * player
  *
  */
  videojs.registerPlugin('customPlaylist',function() {
     var myPlayer = this,
         playlistData,
         playlistItems,
         videoItem,
         itemTitle,
         itemInnerDiv,
         playlistWrapper;

         
     myPlayer.one('loadstart', function() {
         playlistWrapper = document.createElement('div');
         playlistWrapper.className = "bcls-playlist-wrapper";
     });

     myPlayer.one('loadedmetadata', function() {
         playlistData = myPlayer.playlist();
         myPlayer.el().parentNode.appendChild(playlistWrapper);

         /**
          * highlights the current playlist item
          */
         function clearHighlight() {
             var i,
                 iMax = playlistItems.length;
             for (i = 0; i < iMax; i++) {
                 playlistItems[i].setAttribute('style', '2px solid #141B17');
             }
         }

         function setHighlight() {
             var index = myPlayer.playlist.currentItem();
             // override the background color
             playlistItems[index].setAttribute('style', 'border:2px solid #80CBC4;');
         }

         /**
          * loads a playlist item that was clicked on
          */
         function loadPlaylistItem() {
             // item index in playlist array
             var index = parseInt(this.getAttribute('data-playlist-index'), 10);
             myPlayer.playlist.currentItem(index);
             myPlayer.play();
         }

         playlistWrapper.style.width = myPlayer.width() + "px";

         for (i = 0; i < playlistData.length; i++) {
             videoItem = playlistData[i];
             // create the playlist item and set its class and style
             playlistItem = document.createElement('div');
             playlistItem.setAttribute('data-playlist-index', i);
             playlistItem.setAttribute('class', 'bcls-playlist-item');
             // create the inner div and set class and style
             itemInnerDiv = document.createElement('div');
             itemInnerDiv.setAttribute('class', 'bcls-item-inner-div');
             itemInnerDiv.setAttribute('style', 'background-image:url(' + videoItem.thumbnail + ');');
             // create the title and set its class
             itemTitle = document.createElement('span');
             itemTitle.setAttribute('class', 'bcls-title');
             // add the video name to the title element
             itemTitle.appendChild(document.createTextNode(videoItem.name));
             // now append the title to the innerdiv,
             // the innerdiv to the item,
             // and the item to the playlist
             itemInnerDiv.appendChild(itemTitle);
             playlistItem.appendChild(itemInnerDiv);
             playlistWrapper.appendChild(playlistItem);
         }

         var left = document.createElement("div");
         var right = document.createElement("div")
         left.setAttribute('id','left-arrow');
         right.setAttribute('id','right-arrow');


         var parentElement = document.getElementsByClassName("bcls-playlist-wrapper");



         parentElement[0].prepend(left);
         parentElement[0].prepend(right);

         //$( "#left-arrow" ).insertBefore( $(".bcls-playlist-wrapper" ));
         //$( "#right-arrow" ).append( $(".bcls-playlist-wrapper" ));

         document.getElementById('left-arrow').innerHTML='<';
         document.getElementById('right-arrow').innerHTML='>';

         $( ".bcls-playlist-item" ).wrapAll( "<div class='list-container'></div>" );
         $( ".bcls-playlist-item" ).wrapAll( "<div class='list'></div>" );

         var $item = $('div.bcls-playlist-item'), //Cache your DOM selector
         visible = 1, //Set the number of items that will be visible
         index = 0, //Starting index
         endIndex = ( $item.length / visible ) - 1; //End index
         console.log($item.length);
         console.log(endIndex);

    $('div#right-arrow').on('click',(function(){
        if(index < endIndex ){
          index++;
          $item.animate({'right':'+=124px'});
          console.log(index);
        }
    }));

    $('div#left-arrow').click(function(){
        if(index > 0){
          index--;
          $item.animate({'right':'-=124px'});
          console.log(index);
        }
    });


         myPlayer.on('play', function() {
             clearHighlight();
             setHighlight();
         });
         // set click listeners on playlist items
         playlistItems = document.getElementsByClassName('bcls-playlist-item');
         iMax = playlistItems.length;
         for (i = 0; i < iMax; i++) {
             playlistItems[i].addEventListener('click', loadPlaylistItem);
         }

     });
 });
