videojs.registerPlugin('countryFlagCaptionLabel', function() {
  var myPlayer = this;
  myPlayer.on('loadedmetadata',function(){
    // +++ Retrieve the menu options +++
    var menuOptions = myPlayer.controlBar.subsCapsButton.menu.children();

    // +++ Add flag to each menu option +++
    menuOptions.forEach(function(item) {
      if (item.track.language === 'de') {
        item.$('.vjs-menu-item-text').innerHTML = '🇩🇪 ' + item.track.label;
      }
    });

    menuOptions.forEach(function(item) {
      if (item.track.language === 'en') {
        item.$('.vjs-menu-item-text').innerHTML = '🇺🇸 ' + item.track.label;
      }
    });
  });
});
