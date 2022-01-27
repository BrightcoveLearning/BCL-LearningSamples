const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {
      bc_account_id: '3676484086001',
      video_id: '6286612023001'
    }
  }, window.location.origin);

};


const populateSidePanel = () => {
  
  var panelArea = document.getElementById('player_side_panel_hook');
  var para2 = document.createElement("P");
  var t2 = document.createTextNode("This is in the panel.");
  para2.appendChild(t2);
  panelArea.appendChild(para2);

};


const clearSidePanel = () => {
  
  var panelArea = document.getElementById('player_side_panel_hook');
  panelArea.innerHTML = '';
  
};

export { openSidePanel, populateSidePanel, clearSidePanel };