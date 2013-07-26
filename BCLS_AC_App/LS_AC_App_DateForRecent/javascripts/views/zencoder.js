( function( $ ) {

	$( bc ).bind( "init", initialize );

	function initialize() {
		bc.device.fetchContentsOfURL("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=zencoderinc&include_rts=1",onGetTwitterSuccess, onGetDataError);
		bc.core.getData("zcblog", onGetCorpBlogSuccess, onGetDataError);

		registerEventListeners();
	}

})( jQuery )
