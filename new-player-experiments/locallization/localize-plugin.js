videojs.plugin('pluginLocalize', function() {
  videojs.addLanguage('de', {
      "Hello": "Guten Tag",
      "Good Bye": "Auf Wiedersehen",
  });
  var myPlayer = this,
  textSpan = document.createElement('span');
  textSpan.className = "localizeStyle"
  textSpan.innerHTML = myPlayer.localize("Hello") + "/" + myPlayer.localize("Good Bye");
  myPlayer.el().appendChild(textSpan);
});