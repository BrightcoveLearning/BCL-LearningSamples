( function( $ ) {

	$( bc ).bind( "init", initialize );

	var _dataUpdate = {};
	var _dataRecent = {};
	var _dataVideos = {};
	var _twitterFeed = {};

	var recentUpdates = 0;
	var recentContent = 0;
	var recentVideos = 0;
	var recentTweets = 0;

	function initialize() {
		$.mobile.defaultPageTransition = 'none';
		$.mobile.activeBtnClass = 'aNonExistentSelector';

		bc.core.cache( "lastVisit", "2012-06-01T22:04:23.763Z" );

		bc.core.getData("acrecent", onGetRecentDataSuccess, onGetDataError);
		bc.core.getData("acupdate", onGetUpdateDataSuccess, onGetDataError);
		bc.core.getData("acvideos", onGetVideoDataSuccess, onGetDataError);
		//bc.core.getData("bctwitter", onGetTwitterSuccess, onGetDataError);
		bc.device.fetchContentsOfURL("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=brightcove&include_rts=1",onGetTwitterSuccess, onGetDataError);

		registerEventListeners();
	}

	function registerEventListeners() {
		$( "#product-updates-list" ).on( "tap", "li", injectUpdatePageContent );
		$( "#recent-content-list" ).on( "tap", "li", injectRecentPageContent );
		$( "#recent-videos-list" ).on( "tap", "li", injectRecentPageContent );
		//$( '#content-details' ).live( "pageshow", showDetails );
		$("body").on( "tap", ".mainNavTargetBC", topNavClickedBC);
		$("body").on( "tap", ".mainNavTargetVC", topNavClickedVC);
		$("body").on( "tap", ".mainNavTargetZC", topNavClickedZC);
	}

	function onGetTwitterSuccess( data ){
		_twitterFeed = JSON.parse( data );
	}

	function topNavClickedBC( event ) {
		bc.device.navigateToView("brightcove.html");
	}

	function topNavClickedVC( event ) {
		bc.device.navigateToView("videocloud.html");
	}

	function topNavClickedZC( event ) {
		bc.device.navigateToView("zencoder.html");
	}

	function showDetails( event, ui ) {
		console.log(ui);
	}

	function onGetVideoDataSuccess( data ) {
		var lastVisitFromCache = bc.core.cache( "lastVisit" );
		var lastVisitDateObject = new Date( lastVisitFromCache );
		for (var i = 0; i < data.length; i++) {
			var thisItem = data[i];
			var fullDescription = thisItem.description;
			var theLink = thisItem.link;
			var displayDescription = $(fullDescription).find( ".field-item.odd" ).html();
			var displayDescription = $.trim(displayDescription);
			var videoID = $(fullDescription).filter('.field-field-video-id').find('.odd').html();
			var videoID = $.trim(videoID);
			data[i].isVideo = true;
			data[i].displayDescription = displayDescription;
			data[i].videoID = videoID;
			data[i].recentBoolean = checkForRecent( thisItem.pubDate, lastVisitDateObject );
			if ( data[i].recentBoolean ) {
				recentVideos ++;
			}
		}
		_dataVideos = data;
		setVideosList( data );
	}

	function onGetUpdateDataSuccess( data ) {
		var lastVisitFromCache = bc.core.cache( "lastVisit" );
		var lastVisitDateObject = new Date( lastVisitFromCache );
		for (var i = 0; i < data.length; i++) {
			var thisItem = data[i];
			var fullDescription = thisItem.description;
			var startOfH3Location = fullDescription.indexOf("<h3>");
			var docHTML = fullDescription.slice( startOfH3Location );
			var releaseDate = $(fullDescription).find( ".date-display-single" ).html();
			data[i].docHTML = docHTML;
			data[i].releaseDate = releaseDate;
			data[i].recentBoolean = checkForRecent( thisItem.pubDate, lastVisitDateObject );
			if ( data[i].recentBoolean ) {
				recentUpdates ++;
			}
		}
		_dataUpdate = data;
		setUpdateList( data );
	}

	function onGetRecentDataSuccess( data ) {
		var lastVisitFromCache = bc.core.cache( "lastVisit" );
		var lastVisitDateObject = new Date( lastVisitFromCache );
		for (var i = 0; i < data.length; i++) {
			var thisItem = data[i];
			var fullDescription = thisItem.description;
			var theLink = thisItem.link;
			var isVideo = theLink.indexOf( "training-videos" ) != -1;
			if ( isVideo ){
				var displayDescription = $(fullDescription).find( ".field-item.odd" ).html();
				var displayDescription = $.trim(displayDescription);
				var videoID = $(fullDescription).filter('.field-field-video-id').find('.odd').html();
				var videoID = $.trim(videoID);
				data[i].displayDescription = displayDescription;
				data[i].isVideo = true;
				data[i].linkPhrase = "Watch the Video";
				data[i].videoID = videoID;
			} else {
				var displayDescription = $(fullDescription).find( ".BCL-objective" ).html();
				var displayDescription = $.trim(displayDescription);
				var endOfBreakLocation = fullDescription.indexOf("<!--break-->") + 12;
				var docHTML = fullDescription.slice( endOfBreakLocation );
				data[i].displayDescription = displayDescription;
				data[i].isVideo = false;
				data[i].linkPhrase = "Read the Entire Document";
				data[i].docHTML = $.trim(docHTML);
			}
			data[i].recentBoolean = checkForRecent( thisItem.pubDate, lastVisitDateObject );
			if ( data[i].recentBoolean ) {
				recentContent ++;
			}
		}
		_dataRecent = data;
		setRecentList( data );
	}

	function onGetDataError( error ) {
//console.log(error);
	}

	function setVideosList( data ) {
		$(".ui-li-count.videos").html( recentVideos );

		//The object we will pass to markup that will be used to generate the HTML.
		var context = { "acrecentitems": data };

		//The SDK automatically parses any templates you associate with this view on the bc.templates object.
		var markupTemplate = bc.templates["display-recent-item-tmpl"];

		//The generated HTML for this template.
		var html = Mark.up( markupTemplate, context );

		//Set the HTML of the element.
		$( "#recent-videos-list" ).append( html ).listview();
		$( "#recent-videos-list" ).find("ul").listview();
	}

	function setUpdateList( data ) {
		$(".ui-li-count.updates").html( recentUpdates );

		//The object we will pass to markup that will be used to generate the HTML.
		var context = { "acupdateitems": data };

		//The SDK automatically parses any templates you associate with this view on the bc.templates object.
		var markupTemplate = bc.templates["display-update-item-tmpl"];

		//The generated HTML for this template.
		var html = Mark.up( markupTemplate, context );

		//Set the HTML of the element.
		$( "#product-updates-list" ).append( html ).listview();
		$( "#product-updates-list" ).find("ul").listview();
	}

	function setRecentList( data ) {
		$(".ui-li-count.content").html( recentContent );

		//The object we will pass to markup that will be used to generate the HTML.
		var context = { "acrecentitems": data };

		//The SDK automatically parses any templates you associate with this view on the bc.templates object.
		var markupTemplate = bc.templates["display-recent-item-tmpl"];

		//The generated HTML for this template.
		var html = Mark.up( markupTemplate, context );

		//Set the HTML of the element.
		$( "#recent-content-list" ).append( html ).listview();
		$( "#recent-content-list" ).find("ul").listview();
	}

 function injectUpdatePageContent( evt ) {
console.log( $(this).data("index") );
	var guid = $(this).data("guid");
	var selectedItem = getUpdateItemByGUID(guid);
	var context = { selectedUpdate: selectedItem };
	var markupTemplate = bc.templates["display-update-tmpl"];
	var html = Mark.up( markupTemplate, context );

	selectedItem.recentBoolean = false;

	$(this).removeAttr("data-theme");
	$(this).attr("data-theme","c").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
	//$(this).trigger("enhance");
	var liHolder = $(this);


	recentUpdates --;
	$(".ui-li-count.updates").html( recentUpdates );

	$( "#drill-down-detail-page" ).html( html );
 }

	function injectRecentPageContent( evt ) {
		var guid = $(this).data("guid");
		detailsShowningGUID =  guid;
		var selectedItem = getRecentItemByGUID(guid);

		if (selectedItem.isVideo) {
			var context = { "videoID": selectedItem.videoID };
			var markupTemplate = bc.templates["play-video-tmpl"];
		} else {
			var context = { "docHTML": selectedItem.docHTML };
			var markupTemplate = bc.templates["display-doc-tmpl"];
		}

		var html = Mark.up( markupTemplate, context );

		selectedItem.recentBoolean = false;
		recentContent --;
		$(this).removeAttr("data-theme");
		$(this).attr("data-theme","c").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
		$(this).trigger("enhance");
		$(".ui-li-count.content").html( recentContent );

		$( "#drill-down-detail-page" ).html( html );
	}

	function getUpdateItemByGUID( localGUID ) {
		var len=_dataUpdate.length;
		for(var i=0;i<len;i++){
			if(_dataUpdate[i].guid == localGUID){
				return _dataUpdate[i];
			}
		}
	}

	function getRecentItemByGUID( localGUID ) {
		var len=_dataRecent.length;
		for(var i=0;i<len;i++){
			if(_dataRecent[i].guid == localGUID){
				return _dataRecent[i];
			}
		}
	}

	function checkForRecent( pubDate, lastVisit ) {
		var publishDateObject = new Date( pubDate );
		if ( publishDateObject > lastVisit ) {
			return true;
		} else {
			return false;
		}
	}

})( jQuery )
