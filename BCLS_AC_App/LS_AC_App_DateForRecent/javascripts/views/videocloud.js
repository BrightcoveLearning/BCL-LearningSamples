( function( $ ) {

  $( bc ).bind( "init", initialize );

  function initialize() {
    bc.core.getData("vcrecent", onGetRecentDataSuccess, onGetDataError);
    bc.core.getData("vcupdate", onGetUpdateDataSuccess, onGetDataError);
    bc.core.getData("vcvideos", onGetVideoDataSuccess, onGetDataError);

    registerEventListeners();

  }

})( jQuery )
