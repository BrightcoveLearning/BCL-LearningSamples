
Array.prototype.unique = function () {
	var r = new Array();
	o:for(var i = 0, n = this.length; i < n; i++) {
		for(var x = 0, y = r.length; x < y; x++) {
			if(r[x]==this[i]) {
				continue o;
			}
		}
		r[r.length] = this[i];
	}
	return r;
}

// JQUERY SELECTORS ------------------------------------------------

$(document).ready(function(e) {
	
	// Round the top bar in ie
	$("#topbar").corner("top 20px");
	
	var searchField = $("#searchField");
	var defaultVal = "Search Chipotle.com";
	searchField.focusin(function(e) {
		if (event.target.value == defaultVal) {
			event.target.value = "";
		}
	});
	searchField.focusout(function(e) {
		if (event.target.value == "") {
			event.target.value = defaultVal;
		}
	});
	$("#searchForm").submit(function(e) {
		if ($("#searchField").val() == defaultVal) return false;
		var url = $(this).attr("action");
		var term = searchField.val();
		url += term;
		window.location.href = url;
		return false;
	});
});


// MODELS ----------------------------------------------------------

var sqBrightcoveAPIToken = "NrnXVEJibjHtzPB46iWRasrKM7fkFh4j_O00-XFihtOYSpowJmeSdA..";

window.PlaylistMenu = Backbone.Model.extend();
window.PlaylistMenuCollection = Backbone.Collection.extend({
	model:PlaylistMenu, 
	value: null, 
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_all_playlists&token=" +
		sqBrightcoveAPIToken +
		"&fields=id,name,referenceid,videos,&video_fields=customfields&callback=?"; 
	}, 
	parse: function(response) {
		
	var playlists = response.items;
	
	var tempPlaylists = [];
	for (var i=0; i<playlists.length; i++) {
		var videos = playlists[i].videos;
		// filter out playlists with no videos
		if (videos.length > 0 && videos[0].customFields) {
			playlists[i].subcat = videos[0].customFields.playlistsubcategory;
			playlists[i].firstVideoId = videos[0].id;
			if (videos.length > 0 && videos[0].customFields && videos[0].customFields.playlistsubcategory != "") tempPlaylists.push(playlists[i]);
			//tempPlaylists[tempPlaylists.length-1][videos] = null;
		}	
	}
	
	// Force reorder items
	var properOrder = ["Culture", "Food", "Policies and Procedures", "Employee Info", "Events"];
	var newPlaylists = [];
	for (var i=0; i<properOrder.length; i++) {
		for (var k=0; k<tempPlaylists.length; k++) {
			if (properOrder[i] == tempPlaylists[k].name) {
				newPlaylists.push(tempPlaylists[k]);
			}
		}
	}
	
	var out = {};
	out.playlists = newPlaylists;
	return out;
	}
});

window.Video = Backbone.Model.extend();
window.RecentVideosCollection = Backbone.Collection.extend({
	model: Video, 
	value: null,
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_all_videos&token=" + 
		sqBrightcoveAPIToken + 
		"&page_size=4&fields=id,name,shortdescription,creationdate,thumbnailurl,length&callback=?";
	}, 
	parse: function(response) {
		var playlistItems = response.items;
		return response;
	}
});

window.Playlists = Backbone.Model.extend();
window.PlaylistsCollection = Backbone.Collection.extend({
	model:Playlists, 
	value: null, 
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_all_playlists&token=" + 
		sqBrightcoveAPIToken + 
		"&video_fields=id,name,customfields&fields=id,name,thumbnailurl,videos,referenceid&callback=?";
	}, 
	parse: function(response) {
		var playlistItems = response.items;
		// Sort into order by playlistsubcategory
		var tempTopArr = [];
		for (var i=0; i<playlistItems.length; i++) {
			var playlist = playlistItems[i];
			var videos = playlist.videos;
			// Loop through the videos within this playlist object to cluster videos by subcategory
			// We only need the subcategory name once per video, since that's what the view needs
			//var newVideos = [];
			var vidIds = []; // array of objects, so we can match the name with the id
			for (var j=0; j<videos.length; j++) {
				var video = videos[j];
				if (video.customFields != null) {
					var subcat = video.customFields.playlistsubcategory;
					//newVideos.push(subcat);
					// Also grab the video id
					// only grab the first one in that category
					var dontPush = false;
					for (var m=0; m<vidIds.length; m++) {
						if (vidIds[m].subcategory == subcat) {
							dontPush = true;
							break;
						}
					}
					if (dontPush == false) {
						vidIds.push({id:video.id, subcategory:subcat});
					}
				}
			}
			
			// remove duplicates from newVideos array
			//newVideos = newVideos.unique();
			playlist.subcategories = vidIds;
			/*if (videos.length > 0) {
				//playlist.firstVideoId = videos[0].id;
				// match video id to it's subcat
				for (var k=0; k<vidIds.length; k++) {
					for (var l=0; l<newVideos.length; l++) {
						if (vidIds[k].subcategory == newVideos[l]) {
							playlist.firstVideoId = vidIds[k].id;
							break;
						}
					}
				}
			}*/
			//playlist.videos = null;
			// Only add playlists that have videos
			if (playlist.subcategories.length > 0 && playlist.subcategories[0] != "") tempTopArr.push(playlist);
		}
		
		// Force reorder items
		var properOrder = ["Culture", "Food", "Policies and Procedures", "Employee Info", "Events"];
		var newPlaylists = [];
		for (var i=0; i<properOrder.length; i++) {
			for (var k=0; k<tempTopArr.length; k++) {
				if (properOrder[i] == tempTopArr[k].name) {
					newPlaylists.push(tempTopArr[k]);
				}
			}
		}
		
		var out = {};
		out.playlists = newPlaylists;
		return out;
	}
});

window.Tabs = Backbone.Model.extend();
window.TabsCollection = Backbone.Collection.extend({
	model: Tabs, 
	value: null, 
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_playlist_by_reference_id&token=" + 
				sqBrightcoveAPIToken + 
				"&video_fields=id,name,customfields,shortdescription&fields=id,name,thumbnailurl,videos,referenceid&callback=?"; 
	}, 
	parse: function(response) {
		var videos = response.videos;
		var name = response.name;
		
		// Sort into order by playlistsubcategory
		var tempTopArr = [];
		for (var i=0; i<videos.length; i++) {
			var vid = videos[i];
			vid.refId = response.referenceId;
			
			var subcat = vid.customFields.playlistsubcategory;
			var didMatch = false;
			// look through the tempTopArr to see if it matches
			for (var k=0; k<tempTopArr.length; k++) {
				var tempSubCat = tempTopArr[k].videos[0].customFields.playlistsubcategory;
				if (tempSubCat == subcat) {
					didMatch = true;
					tempTopArr[k].videos.push(vid);
					break;
				}
			}
			
			// if we get to the end of the loop without a match, add vid to tempTopArr
			if (!didMatch) {
				var cat = {};
				cat.id = vid.id;
				cat.title = subcat;
				cat.videos = [];
				cat.videos.push(vid);
				tempTopArr.push(cat);
			}
		}
		
		// remove videos from returned json
		for (var i=0; i<tempTopArr.length; i++) {
			tempTopArr[i].videos = null;
		}
		
		var out = {};
		out.playlistTitle = name;
		out.categories = tempTopArr;
		return out;
	}
});

window.PlaylistCategory = Backbone.Model.extend();
window.PlaylistCategoryCollection = Backbone.Collection.extend({
	initialize: function() {
		this._meta = {};
	}, 
	put: function(prop, val) {
		this._meta[prop] = val;
	}, 
	get: function(prop) {
		return this._meta[prop];
	}, 
	model: PlaylistCategory, 
	value: null, 
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_playlist_by_reference_id&token=" +
	sqBrightcoveAPIToken + 
	"&video_fields=id,name,customfields,shortdescription&fields=id,name,thumbnailurl,videos,referenceid&callback=?";
	}, 
	parse: function(response) {
		var videos = response.videos;
		var name = response.name;
		
		// Sort into order by playlistsubcategory
		var tempTopArr = [];
		for (var i=0; i<videos.length; i++) {
			var vid = videos[i];
			vid.refId = response.referenceId;
			
			//if ($vid[customFields] == null) return resp;
			
			var cat = vid.customFields.playlistsubcategory;
			var didMatch = false;
			// look through the tempTopArr to see if it matches
			for (var k=0; k<tempTopArr.length; k++) {
				var subitem = tempTopArr[k][0].customFields.playlistsubcategory;
				if (subitem == cat) {
					didMatch = true;
					tempTopArr[k].push(vid);
					break;
				}
			}
			
			// if we get to the end of the loop without a match, add vid to tempTopArr
			if (!didMatch) {
				var subarr = [];
				subarr.push(vid);
				tempTopArr.push(subarr);
			}
		}
		
		// return just the index indicated by $tab
		// If $tab is null, choose the first one
		if (this.get("tab") == null) {
			var out = {};
			out.title = name;
			out.videos = tempTopArr[0];
			return out;
		} else {
			var tab = this.get("tab");
			tab = tab.replace(/-/g, " ");
			for (var i=0; i<tempTopArr.length; i++) {
				var val = tempTopArr[i];
				if (val[0].customFields.playlistsubcategory == tab) {
					var out = {};
					out.title = name;
					out.videos = val;
					return out;
				}
			}
		}
	}
});

window.VideoTitle = Backbone.Model.extend();
window.VideoTitleCollection = Backbone.Collection.extend({
	model: VideoTitle, 
	value: null, 
	url: function() { 
		return "http://api.brightcove.com/services/library?command=find_video_by_id&token=" + 
		sqBrightcoveAPIToken + 
		"&fields=id,name,shortDescription&callback=?"; 
	}, 
	parse: function(response) {
		var out = {};
		out.videoTitle = response;
		return out;
	}
});






// VIEWS --------------------------------------------------------------

window.PlaylistMenuView = Backbone.View.extend({
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	el: $("#mainMenu"),
	template: $("#playlistMenuTemplate"), 
	render: function() {
		this.clear();
		var html = this.template.tmpl(this.model.toJSON());
		this.el.append(html);
		// highlight active tab.
		if (this.options.category != "") {
			var ref = this;
			$.each($("ul#leftNav li a"), function(index, val) {
				if ($(this).attr("id") == ref.options.category) {
					$(this).addClass("active");
				}
			});
		}
		
		this.options.category == "" ? $("#backLink").html('') : $("#backLink").html('<a href="#">&#171; Home</a>');
		
		return this;
	}, 
	clear: function() {
		$("#mainMenu").empty();
	}
});

window.RecentVideosView = Backbone.View.extend({
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	el: $("#rightBar"), 
	template: $("#recentlyAddedVideosTemplate"), 
	render: function() {
		this.clear();
		var html = this.template.tmpl(this.model.toJSON());
		this.el.append(html);
		
		$("#rightBar").corner();
		
		// highlight the active tab
		if (this.options.vidID != undefined) {
			$("#rightBar ul li#" + this.options.vidID).addClass("active");
		}
		
		$("#rightBar ul li").on("hover", function(event) {
			if($(this).hasClass("active") == false) {
				event.type == "mouseenter" ? $(this).addClass("hover") : $(this).removeClass("hover");
			}
		});
		
		return this;
	}, 
	clear: function() {
		$("#rightBar").empty();
	}
});

window.PlaylistBoxesView = Backbone.View.extend({
	el: $("#centerContent"), 
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	template: $("#playlistBoxTemplate"), 
	render: function(eventName) {
		this.clear();
		this.el.append($("#playlistsHeaderTemplate").tmpl());
		
		var html = this.template.tmpl(this.model.toJSON());
		this.el.append(html);
		
		$(".playlistBox").css('opacity',0);
		//$(".playlistBox ul li.lastChild").corner("bottom");
		
		$.each($(".playlistBox"), function(index, val) {
			$(this).delay(index*100).animate({
				opacity:1
			}, 500);
		});
		
		return this;
	}, 
	clear: function() {
		$("#centerContent").empty();
	}
});

// Draws tabs for a playlist. Within a tab are a list of videos in that category, and a video player
window.TabsView = Backbone.View.extend({
	el: $("#tabbedMenu"), 
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	template: $("#playlistTabsTemplate"), 
	render: function(eventName) {
		this.clear();
		var html = this.template.tmpl(this.model.toJSON());
		this.el.append(html);
		// highlight active tab. If activeSubCat is blank, set the first one
		if (this.options.activeSubSat == "") {
			$("#tabbedPlaylists ul.tabs li:first").addClass("active");
			$("#tabbedPlaylists ul.tabs li:first").parent("a").addClass("active");
		} else {
			$("#tabbedPlaylists ul.tabs li:contains('"+this.options.activeSubSat+"')").addClass("active");
			$("#tabbedPlaylists ul.tabs li:contains('"+this.options.activeSubSat+"')").parent("a").addClass("active");
		}
		
		$("#tabbedPlaylists ul.tabs").corner("top");
		$("#tabbedPlaylists ul.tabs li").corner("top");
		
		return this;
	}, 
	clear: function() {
		$("#tabbedMenu").empty();
	}
});

window.SinglePlaylistCategoryView = Backbone.View.extend({
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	el: $("#tabbedContent"), 
	template: $("#singleCatTemplate"), 
	render: function(eventName) {
		this.clear();
		var html = this.template.tmpl(this.model.toJSON());
		$(this.el).prepend(html);
		
		// highlight the active tab
		if (this.options.vidID != undefined) {
			$(".videoListContainer ul li#" + this.options.vidID).addClass("active");
		}
		
		$(".videoListContainer ul li").on("hover", function(event) {
			if($(this).hasClass("active") == false) {
				event.type == "mouseenter" ? $(this).addClass("hover") : $(this).removeClass("hover");
			}
		});
		
		return this;
	}, 
	clear: function() {
		$(".videoListContainer").remove();
	}
});

window.PlayerView = Backbone.View.extend({
	initialize: function() {
		if(this.model) this.model.bind("reset", this.render, this);
	}, 
	el: $("#tabbedContent"), 
	template: $("#brightcovePlayerTemplate"), 
	render: function() {
		this.clear();
		var html = this.template.tmpl();
		$(this.el).prepend(html);
		return this;
	}, 
	clear: function() {
		$("#videoPlayer").remove();
	}, 
	playVideo: function(vidId) {
		removeBCPlayer();
		addBCPlayer(vidId);
	}
});

window.OverlayPlayerView = Backbone.View.extend({
	initialize: function() {
		if(this.model) this.model.bind("reset", this.render, this);
	},
	el: $("#centerContent"), 
	template: $("#brightcovePlayerTemplate"), 
	render: function() {
		this.clear();
		var html = this.template.tmpl();
		$(this.el).append(html);
		
		$(".loading").remove();
		$("#videoPlayer").width(555);
		$("#videoPlayer").height(313);
		$("#videoPlayer").css({margin: 0, padding: 0});
		
		return this;
	}, 
	clear: function() {
		$("#videoPlayer").remove();
	}, 
	playVideo: function(vidId) {
		// play video
		removeBCPlayer();
		addBCPlayer(vidId);
	}
});

window.VideoTitleView = Backbone.View.extend({
	initialize: function() {
		this.model.bind("reset", this.render, this);
	}, 
	el: $("#tabbedContent"), 
	template: $("#videoTitleTemplate"), 
	render: function() {
		this.clear();
		var html = this.template.tmpl(this.model.toJSON());
		$(this.el).append(html);
	}, 
	clear: function() {
		$("#videoTitle").remove();
	}
});



// ROUTERS -------------------------------------------------------

var AppRouter = Backbone.Router.extend({
	routes: {
		"" : "list",  
		"playlist/:referenceId/:subCatTitle/:videoID" : "playlistWithVideoID", 
		"singlevideo/:videoID": "singleVideo"
	}, 
	list: function() {
		drawPlaylistMenu(this, "");
		
		$("#tabbedMenu").empty();
		$("#tabbedContent").hide();
		$("#videoPlayer").remove();
		$(".videoListContainer").remove();
		$("#videoTitle").remove();
		$("#rightBar").show();
		
		this.groupedPlaylists = new PlaylistsCollection();
		this.groupedPlaylistsView = new PlaylistBoxesView({model:this.groupedPlaylists});
		this.groupedPlaylists.fetch();
		
		this.recentVideos = new RecentVideosCollection();
		this.recentVideosView = new RecentVideosView({model:this.recentVideos});
		this.recentVideos.fetch();
		
	}, 
	playlistWithVideoID: function(refId, subCatTitle, videoID) {
		var referenceId = refId.replace(/-/g, "");
		var playlistSubCat = subCatTitle.replace(/-/g, " ");
		var playlistSubCatWithHyphens = subCatTitle;
		
		$("#tabbedContent").show();
		$("#centerContent").empty();
		$("#rightBar").empty();
		$("#rightBar").hide();
		$("#videoTitle").remove();
		
		drawPlaylistMenu(this, refId);
		
		// Draw the tabs
		this.tabs = new TabsCollection();
		this.tabsView = new TabsView({model:this.tabs, activeSubSat:playlistSubCat});
		this.tabs.fetch({data: {reference_id:referenceId}});
		// Draw the video player
		this.playlistCat = new PlaylistCategoryCollection();
		this.playlistCat.put("tab", playlistSubCatWithHyphens)
		this.playerView = new PlayerView({model:this.playlistCat});
		this.playerView.render();
		// Draw a list of videos from this category
		this.singlePlaylistView = new SinglePlaylistCategoryView({model:this.playlistCat, vidID:videoID});
		this.playlistCat.fetch({data: {reference_id:referenceId, tab:playlistSubCatWithHyphens}});
		this.singlePlaylistView.render();
		
		var player = this.playerView;
		setTimeout(function(){
			player.playVideo(videoID);
			$(".loading").remove();
		}, 1000);
		
		this.videoTitle = new VideoTitleCollection();
		this.videoTitleView = new VideoTitleView({model:this.videoTitle});
		this.videoTitle.fetch({data: {video_id:videoID}});
	}, 
	singleVideo: function(videoID) {
		
		$("#tabbedContent").hide();
		$("#centerContent").empty();
		$("#rightBar").empty();
		
		drawPlaylistMenu(this, "");
		
		this.playerView = new OverlayPlayerView();
		this.playerView.render();
		
		this.recentVideos = new RecentVideosCollection();
		this.recentVideosView = new RecentVideosView({model:this.recentVideos, vidID:videoID});
		this.recentVideos.fetch();
		this.playerView.playVideo(videoID);
	}
});

function drawPlaylistMenu(ref, cat) {
	cat = cat.replace(/-/g, "");
	ref.playlistMenu = new PlaylistMenuCollection();
	ref.playlistMenuView = new PlaylistMenuView({model:ref.playlistMenu, category:cat});
	ref.playlistMenu.fetch();
}

var app = new AppRouter();
Backbone.history.start();



// Brightcove namespace to keep the global clear of clutter
var BCL = {};

// METHODS -------------------------------------------------------

function addBCPlayer(videoID) {
	var params = {};
	//params.playerID = "18731190001"; // testing
	params.playerID = "1317132777001"; // ours
	params.playerKey = "AQ~~,AAABMVsCkIE~,6LIa8TCujIsOwNOKkjXSxGkrIIkZDc4s";
	params.videoId = videoID;
	params.autoStart = "false";
	params.bgcolor = "#000000";
	params.width = "100%";
	params.height = "100%";
	params.isVid = "true";
	params.isUI = "true";
	params.dynamicStreaming = "true";
	params.allowFullScreen = "true";
	params.allowScriptAccess = "true";
	params.wmode = "window";
	params.quality = "high";
	
	BCL.player = brightcove.createElement("object");
	BCL.player.id = "bcPlayer";
	var parameter;
	for (var i in params) {
		parameter = brightcove.createElement("param");
		parameter.name = i;
		parameter.value = params[i];
		BCL.player.appendChild(parameter);
	}
	
	var playerContainer = document.getElementById("videoPlayer");
	brightcove.createExperience(BCL.player, playerContainer, true);
	
	
	
	
	/*
	// data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
	BCL.playerData = { 
		"playerID" : "1317132777001",
		"playerKey" : "AQ~~,AAABMVsCkIE~,6LIa8TCujIsOwNOKkjXSxGkrIIkZDc4s",
		"width" : "100%",
		"height" : "100%",
		"videoID" : videoID 
	};
	// flag to keep track of whether there is a player
	BCL.isPlayerAdded = false;
	// template for the player object - will populate it with data using markup()
	BCL.playerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";
	BCL.addPlayer = function () {
		// if we don't already have a player
		if (BCL.isPlayerAdded == false) {
			BCL.isPlayerAdded = true;
			var playerHTML = "";
			// set the videoID to the selected video
			BCL.playerData.videoID = BCL.videoData[BCL.videoSelect.selectedIndex].videoID;
			// populate the player object template
			playerHTML = BCL.markup(BCL.playerTemplate, BCL.playerData);
			// inject the player code into the DOM
			document.getElementById("videoPlayer").innerHTML = playerHTML;
			// instantiate the player
			brightcove.createExperiences();
		}
		// user must have requested a different video for player already loaded
		else {
			log(BCL.videoSelect.selectedIndex);
			BCL.videoPlayer.loadVideo(BCL.videoData[BCL.videoSelect.selectedIndex].videoID);
		}
	};
	*/
	/* 
	simple HTML templating function
	array example:
	demo.markup("
	{{1}}, {{0}}
	", ["John", "Doe"]);
	object example:
	demo.markup("
	{{last}}, {{first}}
	", {first:"John", last:"Doe"});
	*/
	/*
	BCL.markup = function (html, data) {
		var m;
		var i = 0;
		var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
		
		while (m = match[i++]) {
			html = html.replace(m, data[m.substr(2, m.length-4)]);
		}
		return html;
	};
	*/
}

// player template loaded handler
/*BCL.onTemplateLoaded = function (id) {
  // get a reference to the player
  BCL.player = brightcove.getExperience(id);
  // get references to the experience and video player modules
  BCL.experienceModule = BCL.player.getModule(APIModules.EXPERIENCE);
  BCL.videoPlayer = BCL.player.getModule(APIModules.VIDEO_PLAYER);
};
//The BCL.removePlayer() function itself simply calls the Experience Module unload() method and removes the player code from the DOM:

// function to remove the player
BCL.removePlayer = function () {
  // do this only if we have a player
  if(BCL.isPlayerAdded == true) {
    BCL.isPlayerAdded = false;
    // unload the player
    BCL.experienceModule.unload();
    // remove the player code
    document.getElementById("videoPlayer").innerHTML = "";
  }
};*/

function removeBCPlayer() {
	if (BCL.player != null) {
		brightcove.removeExperience("bcPlayer");
	}
	//BCL.removePlayer();
}





// UTILITY METHODS -------------------------------------------------

function formatTime(millis) {
	var totalSecs = Math.round(millis/1000);
	var mins = Math.floor(totalSecs/60);
	var secs = totalSecs - (mins*60);
	return mins + ":" + secs;
}

function formatDate(milliString) {
	var d = new Date(parseFloat(milliString));
	return d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear();
}

function formatURL(url) {
	return url.replace(/ /g,"-");
}

function log(val) {
	if (typeof console !== undefined && console.log != undefined) {
		console.log("LOG:");
		console.log(val);
	}
}

function truncate(txt, len) {
	if (txt === null || txt === undefined) return "";
	if (len === undefined) len = 0;
	return txt.substring(0, len) + (txt.length > len ? "..." : "");
}

function getListClass(index, total) {
	if (index+1 == total) {
		return "lastChild";
	} else if (index == 0) {
		return "firstChild";
	} else {
		return "child";
	}
}