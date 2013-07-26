var BCLS = (function() {

  var _data = {
    items: [
      {
        "title": "List item number one.",
        "description": "Description for the first list item."
      },
      {
        "title": "List item number two.",
        "description": "Description for the second list item."
      }
    ]
  },

  transitionToSecondPage = function( evt ) {
    var index = $( this ).index();
    var context = { "text": _data.items[index].description };
    var markupTemplate = bc.templates["second-page-tmpl"];
    var html = Mark.up( markupTemplate, context );
    $( "#second-page-content" ).html( html );
    bc.ui.forwardPage( $( "#pagetwo" ) );
  };

  return {

    registerEventListeners: function() {
      $( "#first-page-content" ).on( "tap", "li", transitionToSecondPage );
      $( "#pagetwo" ).on( "tap", ".back-button", bc.ui.backPage );
    },

    setContentOfPage: function() {
      var context = { "listitems": _data.items };
      var markupTemplate = bc.templates["first-page-tmpl"];
      var html = Mark.up( markupTemplate, context );
      $( "#first-page-content" ).html( html );
    }

  }; // end return section

})();

( function( $ ) {

  $( bc ).bind( "init", initialize );

  function initialize() {
    BCLS.registerEventListeners();
    BCLS.setContentOfPage();
  }
})( jQuery )