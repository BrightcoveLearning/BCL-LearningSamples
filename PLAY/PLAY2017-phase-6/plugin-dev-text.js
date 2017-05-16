videojs.plugin('pluginDevTextName', function() {
  var myPlayer = this,
   pluginDevText = document.createElement('p');
  pluginDevText.className = 'pluginDevTextClass',
  pluginDevText.innerHTML = 'Is this session ever going to end?';
  myPlayer.el().appendChild(pluginDevText);
});
