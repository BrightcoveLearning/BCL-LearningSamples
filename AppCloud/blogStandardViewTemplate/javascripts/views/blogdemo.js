( function( $ ) {
  
  /*
   * The Brightcove SDK will fire an "init" event after the document is ready, the device is ready to be interacted with and any
   * locale or markup files have been loaded and populated on the bc.templates object.
   */
  $( bc ).bind( "init", initialize );
  
  function initialize() {
    var myBlog = new blogview();
    $( "#message_container" ).append( myVideosView );


  }
  
})( jQuery )
