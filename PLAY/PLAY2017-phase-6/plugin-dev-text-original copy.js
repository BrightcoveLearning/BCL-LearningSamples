videojs.plugin('pluginDevTextName', function() {
  var myPlayer = this,
   pluginDevText = document.createElement('p');
  pluginDevText.className = 'pluginDevTextClass';
  pluginDevText.innerHTML = 'Becoming a plugin developer';
  myPlayer.el().appendChild(pluginDevText);
});
