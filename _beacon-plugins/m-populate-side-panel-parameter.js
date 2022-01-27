export const populateSidePanelParam = (panelData) => {
  
  var panelArea = document.getElementById('player_side_panel_hook');
  var para2 = document.createElement("P");
  var t2 = document.createTextNode(panelData);
  para2.appendChild(t2);
  panelArea.appendChild(para2);

};
