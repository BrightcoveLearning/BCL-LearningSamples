( function( $ ) {

	$( bc ).bind( "init", initialize );

	var _dataCorpBlog = {};
	var _dataTwitterFeed = {};

	var recentTwitter = 0;
	var recentCorpBlog = 0;

	function initialize() {
		$.mobile.defaultPageTransition = 'none';
		$.mobile.activeBtnClass = 'aNonExistentSelector';

		bc.core.cache( "lastVisit", "2012-12-11T22:04:23.763Z" );

		bc.device.fetchContentsOfURL("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=zencoderinc&include_rts=1",onGetTwitterSuccess, onGetDataError);
		bc.core.getData("zcblog", onGetCorpBlogSuccess, onGetDataError);

		registerEventListeners();
	}

	function registerEventListeners() {
		$( "#corporate-blog-list" ).on( "tap", "li", injectCorpBlogContent );
		$( "#twitter-list" ).on( "tap", "li", injectTwitterContent );
		$("body").on( "tap", ".mainNavTargetBC", topNavClickedBC);
		$("body").on( "tap", ".mainNavTargetAC", topNavClickedAC);
		$("body").on( "tap", ".mainNavTargetVC", topNavClickedVC);
	}

	function onGetCorpBlogSuccess( data ){
		for (var i = 0; i < data.length; i++) {
			var thisItem = data[i];
			//var fullDescription = thisItem.description;
			//var forTease = $(fullDescription).closest('p').html();
			//data[i].forTease = forTease.replace(/<[^>]+>[^<]*<[^>]+>|<[^\/]+\/>/ig, "");
			data[i].recentBoolean = checkForRecent( thisItem.pubDate );
			if ( data[i].recentBoolean ) {
				recentCorpBlog ++;
			}
		}
		_dataCorpBlog = data;
		setCorpBlogList( data );
	}

	function onGetTwitterSuccess( data ){
		var localData = JSON.parse( data );
		for (var i = 0; i < localData.length; i++) {
			var thisItem = localData[i];
			localData[i].guid = thisItem.id;
			localData[i].recentBoolean = checkForRecent( thisItem.created_at );
			if ( localData[i].recentBoolean ) {
				recentTwitter ++;
			}
		}
		_dataTwitterFeed = localData;
		setTwitterList( _dataTwitterFeed );
	}

	function topNavClickedBC( event ) {
		bc.device.navigateToView("brightcove.html");
	}

	function topNavClickedVC( event ) {
		bc.device.navigateToView("videocloud.html");
	}

	function topNavClickedAC( event ) {
		bc.device.navigateToView("appcloud.html");
	}

	function showDetails( event, ui ) {
		console.log(ui);
	}

	function onGetDataError( error ) {
//console.log(error);
	}

	function setTwitterList( data ){
		$(".ui-li-count.twitter").html( recentTwitter );

		//The object we will pass to markup that will be used to generate the HTML.
		var context = { "twitteritems": data };

		//The SDK automatically parses any templates you associate with this view on the bc.templates object.
		var markupTemplate = bc.templates["display-twitter-tmpl"];

		//The generated HTML for this template.
		var html = Mark.up( markupTemplate, context );

		//Set the HTML of the element.
		$( "#twitter-list" ).append( html ).listview();
		$( "#twitter-list" ).find("ul").listview();
	}

	function setCorpBlogList ( data ){
		$(".ui-li-count.corpblog").html( recentCorpBlog );

		//The object we will pass to markup that will be used to generate the HTML.
		var context = { "bccorpblogitems": data };

		//The SDK automatically parses any templates you associate with this view on the bc.templates object.
		var markupTemplate = bc.templates["display-blog-tmpl"];

		//The generated HTML for this template.
		var html = Mark.up( markupTemplate, context );

		//Set the HTML of the element.
		$( "#corporate-blog-list" ).append( html ).listview();
		$( "#corporate-blog-list" ).find("ul").listview();
	}

	function injectCorpBlogContent( evt ){
		var guid = $(this).data("guid");
		var selectedItem = getCorpBlogItemByGUID(guid);
		var context = { selectedCorpBlog: selectedItem };
		var markupTemplate = bc.templates["display-corpblog-tmpl"];
		var html = Mark.up( markupTemplate, context );

		selectedItem.recentBoolean = false;

		$(this).removeAttr("data-theme");
		$(this).attr("data-theme","c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
		$(this).trigger("enhance");

		recentCorpBlog --;
		$(".ui-li-count.corpblog").html( recentCorpBlog );

		$( "#drill-down-detail-page" ).html( html );
	}

	function injectTwitterContent( evt ){
		var guid = $(this).data("guid");
		var selectedItem = getTwitterItemByGUID(guid);

		selectedItem.recentBoolean = false;

		$(this).removeAttr("data-theme");
		$(this).attr("data-theme","c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
		$(this).trigger("enhance");

		recentTwitter --;
		$(".ui-li-count.corpblog").html( recentTwitter );
	}

	function getTwitterItemByGUID( localGUID ) {
		var len=_dataTwitterFeed.length;
		for(var i=0;i<len;i++){
			if(_dataTwitterFeed[i].guid == localGUID){
				return _dataTwitterFeed[i];
			}
		}
	}

	function getCorpBlogItemByGUID( localGUID ) {
		var len=_dataCorpBlog.length;
		for(var i=0;i<len;i++){
			if(_dataCorpBlog[i].guid == localGUID){
				return _dataCorpBlog[i];
			}
		}
	}

	function checkForRecent( pubDate ) {
		var publishDateObject = new Date( pubDate );
		var lastVisitFromCache = bc.core.cache( "lastVisit" );
		var lastVisitDateObject = new Date( lastVisitFromCache );
		if ( publishDateObject > lastVisitDateObject ) {
			return true;
		} else {
			return false;
		}
	}

})( jQuery )
