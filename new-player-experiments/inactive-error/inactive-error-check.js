videojs.plugin('inactiveErrorCheck', function() {
  var myPlayer = this;
  myPlayer.one('bc-catalog-error', function(){
    var specificError;
    myPlayer.errors({
      'errors': {
        '-10': {
          'headline': 'The video you are trying to watch is inactive.',
          'dismiss': false
        }
      }
    });
    if (typeof(myPlayer.catalog.error) !== 'undefined') {
      specificError = myPlayer.catalog.error.data[0];
      if (specificError !== 'undefined' & specificError.error_code == "VIDEO_NOT_PLAYABLE") {
        myPlayer.error({code:'-10'});
      };
    };
  });
});
