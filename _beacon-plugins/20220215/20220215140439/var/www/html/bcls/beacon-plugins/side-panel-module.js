const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {}
  }, window.location.origin);

};


const populateSidePanel = (eventObj) => {
  console.log('eventObj: ', eventObj);
  var panelArea = document.getElementById('player_side_panel_hook');
  var para2 = document.createElement('H1');
  var t2 = document.createTextNode('This is content in the side panel.', eventObj);
  para2.appendChild(t2);
  panelArea.appendChild(para2);

};


const clearSidePanel = () => {
  
  var panelArea = document.getElementById('player_side_panel_hook');
  panelArea.innerHTML = '';
  
};

export { openSidePanel, populateSidePanel, clearSidePanel };