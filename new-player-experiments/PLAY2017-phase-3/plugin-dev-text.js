videojs.plugin('pluginDevTextName', function(options) {
  var myPlayer = this,
    pluginDevText = document.createElement('p');
  pluginDevText.className = 'pluginDevTextClass';
  pluginDevText.innerHTML = options.dynamicText;
  myPlayer.el().appendChild(pluginDevText);
});
