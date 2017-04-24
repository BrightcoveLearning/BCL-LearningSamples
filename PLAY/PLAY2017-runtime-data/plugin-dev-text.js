videojs.plugin('pluginDevTextName', function(options) {
  var myPlayer = this,
    pluginDevText = document.createElement('p');
  pluginDevText.style.color = options.textColor;
  pluginDevText.className = 'pluginDevTextClass';
  pluginDevText.innerHTML = options.dynamicText;
  myPlayer.el().appendChild(pluginDevText);
});
