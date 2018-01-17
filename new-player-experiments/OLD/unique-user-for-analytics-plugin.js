videojs.plugin('uniqueUserForAnalyticsPlugin', function(options) {
  var myPlayer = this,
    userPath = '',
    uniqueViewer = '';
  //Assign uniqueViewer a value according to your app and business rules
  //In this example, parsing the path passed to the plugin in the options object
  userPath = options.path;
  uniqueViewer = userPath.substring( userPath.lastIndexOf('/') + 1 );
  //Assign a user variable to Analytic's settings object
  myPlayer.bcAnalytics.settings.user = uniqueViewer;
});