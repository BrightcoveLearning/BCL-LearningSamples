var pageContent = '<h2> This is content in the <em>custom page</em> passed as a parameter from a data file</h2><br>'
  + '<p>You can build your HTML in many ways and the page can contain the content you choose. You are NOT limited to the page types shown in the page layout UI.</p><br>'
  + '<p>Even use images!</p>'
  + '<img src="https://solutions.brightcove.com/bcls/beacon-plugins/yachats-far.png"><br><br>'
//  + '<iframe src="https://beacon-help.support.brightcove.com/ott-plugins/index.html" title="Beacon Plugins Index Page"></iframe> <br><br>' + 
' <video-js id="myPlayerID"' + 
'    data-account="1752604059001"' + 
'    data-player="SJjxXEGZx"' + 
'    data-embed="default"' + 
'    controls=""' + 
'    data-video-id="4607357817001"' + 
'    data-playlist-id=""' + 
'    data-application-id=""' + 
'    width="640" height="360"></video-jsmy>' + 
'  <script src="https://players.brightcove.net/1752604059001/SJjxXEGZx_default/index.min.js"></script>' + 
'' + 
'  <script type="text/javascript">' + 
'    videojs.getPlayer(\'myPlayerID\').ready(function () {' + 
'      var myPlayer = this;' + 
'      myPlayer.createModal(\'Using the helper function\');' + 
'    });' + 
'  </script>'

export { pageContent };
