function topNavClickedBC( event ) {
  bc.device.navigateToView("brightcove.html");
  if ($('#dmanualCollapse').hasClass('in')) {
    $("#amanualCollapse").click();
  }
}

function topNavClickedVC( event ) {
  bc.device.navigateToView("videocloud.html");
  if ($('#dmanualCollapse').hasClass('in')) {
    $("#amanualCollapse").click();
  }
}

function topNavClickedZC( event ) {
  bc.device.navigateToView("zencoder.html");
  if ($('#dmanualCollapse').hasClass('in')) {
    $("#amanualCollapse").click();
  }
}

function topNavClickedS( event ) {
  bc.device.navigateToView("status.html");
  if ($('#dmanualCollapse').hasClass('in')) {
    $("#amanualCollapse").click();
  }
}

Mark.pipes.date = function (date) {
    return new Date(+date || date).toLocaleDateString();
};

var player,videoPlayer;

/*(function () {
  var appInit = bc.core.cache("appInit");
  if ( appInit == null) {
    appInit = true;
  }
})();

( function () {
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
})();*/
