( function( $ ) {
  
  /*
   * The Brightcove SDK will fire an "init" event after the document is ready, the device is ready to be interacted with and any
   * locale or markup files have been loaded and populated on the bc.templates object.
   */
  $( bc ).bind( "init", initialize );
  
  function initialize() {
    var context = { "view_name": "localesDemo" },
        helloMarkup = bc.templates["hello-tmpl"],
        goodbyeMarkup = bc.templates["goodbye-tmpl"],
        helloHTML = Mark.up( helloMarkup, context ),
        goodbyeHTML = Mark.up( goodbyeMarkup, context );
    
    $( "#message_container" ).append( helloHTML )
                             .append( goodbyeHTML );
  }
  
})( jQuery )
