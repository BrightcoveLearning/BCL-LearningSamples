const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {}
  }, window.location.origin);

};

const populateSidePanelStadium = (eventObj) => {
  console.log('*** enablePlayerSidePanel eventObj***: ', eventObj);
  var panelArea = document.getElementById('player_side_panel_hook');

  var content = '' + 
'<!DOCTYPE html>' + 
'<html lang="en">' + 
'    <head>' + 
'        <meta charset="UTF-8">' + 
'        <title>Rally</title>' + 
'        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' + 
'        ' + 
'        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700|Nunito:400,600,700,800,900|Oswald:400,500,600|Roboto:400,500,600|Luckiest+Guy|Ubuntu+Mono|Saira:300,400,600,700|Open+Sans+Condensed:700|Sintony:400,700|Fredoka+One&display=swap" rel="stylesheet">' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/static/css/bootstrap.css">' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/static/css/font-awesome.css">' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/static/css/fonts.css">' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/static/css/rc-slider.css">' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/static/css/video-js.css">' + 
'' + 
'        ' + 
'        <link href="https://sparks-cdn.ipowow.com/overlay/static/css/app.2990444a.css" rel="stylesheet">' + 
'        ' + 
'' + 
'        <script type="text/javascript" src="https://polyfill.io/v3/polyfill.js?version=3.110.1&features=String.prototype.replaceAll"></script>' + 
'        <script type="text/javascript" src="https://sparks-cdn.ipowow.com/overlay/settings/47f29361.js"></script>' + 
'        <link rel="stylesheet" href="https://sparks-cdn.ipowow.com/overlay/settings/78a7dae7.css">' + 
'' + 
'        ' + 
'        <link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/manifest.b063bc8e.js">' + 
'        ' + 
'        <link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/vendor.4d915fac.js">' + 
'        ' + 
'        <link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/main.b8ed34eb.js">' + 
'        ' + 
'    <link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/vendor.4d915fac.js">' + 
'<link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/main.b8ed34eb.js">' + 
'<link rel="preload" as="script" href="https://sparks-cdn.ipowow.com/overlay/static/js/manifest.b063bc8e.js">' + 
'</head>' + 
'    <body>' + 
'        <div id="root"></div>' + 
'        <script>' + 
'            window.staticAssetsBaseURL = \'https:\\/\\/sparks-cdn.ipowow.com\';' + 
'            window.componentConfig = "{}";' + 
'        </script>' + 
'        ' + 
'        <script type="text/javascript" src="https://sparks-cdn.ipowow.com/overlay/static/js/manifest.b063bc8e.js" defer></script>' + 
'        ' + 
'        <script type="text/javascript" src="https://sparks-cdn.ipowow.com/overlay/static/js/vendor.4d915fac.js" defer></script>' + 
'        ' + 
'        <script type="text/javascript" src="https://sparks-cdn.ipowow.com/overlay/static/js/main.b8ed34eb.js" defer></script>' + 
'        ' + 
'    </body>' + 
'</html>' + 
'';

  panelArea.insertAdjacentHTML('afterbegin', content);
};


const populateSidePanel = (eventObj) => {
  console.log('*** enablePlayerSidePanel eventObj***: ', eventObj);
  var panelArea = document.getElementById('player_side_panel_hook');
  var content = '<h3>Example event object passed to the enablePlayerSidePanel event handler</h3>'
    + '<br><br>{<br>'
    + ' asset_id: ' + '"' + eventObj.asset_id + '"<br>'
    + ' bc_account_id: ' + '"' + eventObj.bc_account_id + '"<br>'
    + ' device: ' + '"' + eventObj.device + '"<br>'
    + ' page_id: ' + eventObj.page_id + '<br>'
    + ' page_type: ' + '"' + eventObj.page_type + '"<br>'
    + ' playlist_id: ' + eventObj.playlist_id + '<br>'
    + ' slug: ' + '"' + eventObj.slug + '"<br>'
    + ' user_language: ' + '"' + eventObj.user_language + '"<br>'
    + ' video_id: ' + '"' + eventObj.video_id + '"<br>'
    + '}';
  panelArea.insertAdjacentHTML('afterbegin', content);
};


const clearSidePanel = () => {
  
  var panelArea = document.getElementById('player_side_panel_hook');
  panelArea.innerHTML = '';
  
};

export { openSidePanel, populateSidePanel, clearSidePanel, populateSidePanelStadium };