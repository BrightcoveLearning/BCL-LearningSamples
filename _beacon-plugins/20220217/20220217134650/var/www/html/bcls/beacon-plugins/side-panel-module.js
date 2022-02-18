const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {}
  }, window.location.origin);

};


const populateSidePanel = (eventObj) => {
  console.log('*** enablePlayerSidePanel eventObj***: ', eventObj);
  var panelArea = document.getElementById('player_side_panel_hook');
  var content = '<h3>Example event object passed to the enablePlayerSidePanel event handler</h3>'
    + '{<br><br>'
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

export { openSidePanel, populateSidePanel, clearSidePanel };