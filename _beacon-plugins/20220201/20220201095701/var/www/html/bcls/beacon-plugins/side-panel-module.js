const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {asset_id: 1111}
  }, window.location.origin);

};


const populateSidePanel = (event) => {
  
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