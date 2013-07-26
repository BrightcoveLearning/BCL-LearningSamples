( function( $ ) {

	$( bc ).bind( "init", initialize );


	function initialize() {
	  var newDate = new Date();
	  var newLastVisitFromCache = bc.core.cache( "newLastVisit");
	  var newLastVisitFromCacheObject = new Date( newLastVisitFromCache );
	  var firstVisitDate = new Date( "Tue Jan 10 2012 11:11:11 GMT-0500 (EST)" );

	  if (newLastVisitFromCache == null ) {
	    bc.core.cache( "lastVisit", firstVisitDate );
	    bc.core.cache( "newLastVisit", newDate );
	  }else{
	    bc.core.cache( "lastVisit", newLastVisitFromCache );
	    bc.core.cache( "newLastVisit", newDate );
	  }

		bc.device.fetchContentsOfURL("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=brightcove&include_rts=1",onGetTwitterSuccess, onGetDataError);
		bc.core.getData("corpblog", onGetCorpBlogSuccess, onGetDataError);
		bc.core.getData("abouthtml", onGetAboutHTMLSuccess, onGetDataError);

		registerEventListeners();
	}

})( jQuery )