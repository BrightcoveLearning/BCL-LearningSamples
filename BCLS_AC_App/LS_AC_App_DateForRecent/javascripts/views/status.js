( function( $ ) {

  var $body = $('body');

  $( bc ).bind( "init", initialize );

  function initialize() {
    bc.core.cache( "lastVisit", "2012-12-11T22:04:23.763Z" );
    bc.device.setAutoRotateDirections(["all"]);
    registerEventListeners();
    populateNATable();
  }

  function makeSuccessHandler( dataSourceName ) {
      return function( data ) {
          var theIconName = returnIconName( data[0].sb_status );
          var divSelector = "#"+dataSourceName+" div";
          $( divSelector ).addClass( theIconName );
          var aSelector = "#"+dataSourceName+" a";
          $( aSelector ).attr( "title", data[0].sb_message );
      };
  }

  function setContentOfPage( services, selector ) {
    var context = { "services": services };
    var markupTemplate = bc.templates["table-rows-tmpl"];
    var html = Mark.up( markupTemplate, context );
    $( selector ).html( html );
  }

  function registerEventListeners() {
    $body.on( "tap", "#mainNavTargetBC", topNavClickedBC);
    $body.on( "tap", "#mainNavTargetVC", topNavClickedVC);
    $body.on( "tap", "#mainNavTargetZC", topNavClickedZC);
    $body.on( "tap", "#mainNavTargetS", topNavClickedS);

    $('a[data-toggle="tab"]').on('shown', function (e) {
      var selectedRegion = $(e.target).html();
      switch ( selectedRegion ) {
        case "North America":
        populateNATable();
          break;
        case "EMEA":
          populateEMEATable();
          break;
        case "Japan":
          populateJapanTable();
          break;
        case "APAC":
          populateAPACTable();
          break;
      } //end switch
    }) // end on function
  } // end registerEventListeners

  function populateNATable( ) {
    var naServices = [
       { dataSource: "nadissyn", title: "Distribution/Syndication" },
       { dataSource: "nalivestream", title: "Live Streaming" },
       { dataSource: "namars", title: "Media API Read Service" },
       { dataSource: "napbak", title: "Playback - Akamai" },
       { dataSource: "napbbc", title: "Playback - Brightcove" },
       { dataSource: "napblime", title: "Playback - Limelight" },
       { dataSource: "naanalytics", title: "Reporting/Analytics" },
       { dataSource: "nauploading", title: "Uploading" },
       { dataSource: "navcstudio", title: "Video Cloud - Studio" },
       { dataSource: "navidproc", title: "Video Processing" }
    ];
    setContentOfPage( naServices, "#natable" );
    for (var i=0; i < naServices.length; i++) {
      var dataSourceName = naServices[i].dataSource;
      var myHandler = makeSuccessHandler(dataSourceName);
      bc.core.getData(dataSourceName, myHandler, onGetDataError);
    }
  }

  function populateEMEATable( ) {
    var emeaServices = [
       { dataSource: "emeadissyn", title: "Distribution/Syndication" },
       { dataSource: "emealivestream", title: "Live Streaming" },
       { dataSource: "emeamars", title: "Media API Read Service" },
       { dataSource: "emeapbak", title: "Playback - Akamai" },
       { dataSource: "emeapbbc", title: "Playback - Brightcove" },
       { dataSource: "emeapblime", title: "Playback - Limelight" },
       { dataSource: "emeaanalytics", title: "Reporting/Analytics" },
       { dataSource: "emeauploading", title: "Uploading" },
       { dataSource: "emeavcstudio", title: "Video Cloud - Studio" },
       { dataSource: "emeavidproc", title: "Video Processing" }
    ];
    setContentOfPage( emeaServices, "#emeatable" );
    for (var i=0; i < emeaServices.length; i++) {
      var dataSourceName = emeaServices[i].dataSource;
      var myHandler = makeSuccessHandler(dataSourceName);
      bc.core.getData(dataSourceName, myHandler, onGetDataError);
    }
  }

  function populateJapanTable( ) {
    var jpServices = [
       { dataSource: "jpdissyn", title: "Distribution/Syndication" },
       { dataSource: "jplivestream", title: "Live Streaming" },
       { dataSource: "jpmars", title: "Media API Read Service" },
       { dataSource: "jppbak", title: "Playback - Akamai" },
       { dataSource: "jppbbc", title: "Playback - Brightcove" },
       { dataSource: "jppblime", title: "Playback - Limelight" },
       { dataSource: "jpanalytics", title: "Reporting/Analytics" },
       { dataSource: "jpuploading", title: "Uploading" },
       { dataSource: "jpvcstudio", title: "Video Cloud - Studio" },
       { dataSource: "jpvidproc", title: "Video Processing" }
    ];
    setContentOfPage( jpServices, "#japantable" );
    for (var i=0; i < jpServices.length; i++) {
      var dataSourceName = jpServices[i].dataSource;
      var myHandler = makeSuccessHandler(dataSourceName);
      bc.core.getData(dataSourceName, myHandler, onGetDataError);
    }
  }

  function populateAPACTable( ) {
    var apacServices = [
       { dataSource: "apacdissyn", title: "Distribution/Syndication" },
       { dataSource: "apacmars", title: "Media API Read Service" },
       { dataSource: "apacpbak", title: "Playback - Akamai" },
       { dataSource: "apacpbbc", title: "Playback - Brightcove" },
       { dataSource: "apacpblime", title: "Playback - Limelight" },
       { dataSource: "apacanalytics", title: "Reporting/Analytics" },
       { dataSource: "apacuploading", title: "Uploading" },
       { dataSource: "apacvcstudio", title: "Video Cloud - Studio" },
       { dataSource: "apacvidproc", title: "Video Processing" }
    ];
    setContentOfPage( apacServices, "#apactable" );
    for (var i=0; i < apacServices.length; i++) {
      var dataSourceName = apacServices[i].dataSource;
      var myHandler = makeSuccessHandler(dataSourceName);
      bc.core.getData(dataSourceName, myHandler, onGetDataError);
    }
  }

  function onGetDataError( error ) {
    console.log(error);
  }

  function returnIconName ( status ){
  	switch ( status ) {
      case "Up": return "check";
      case "Announcement": return "check";
  		case "Info": return "info";
  		case "Warning": return "warning";
  		case "Down": return "error";
  	}
  }

})( jQuery )
