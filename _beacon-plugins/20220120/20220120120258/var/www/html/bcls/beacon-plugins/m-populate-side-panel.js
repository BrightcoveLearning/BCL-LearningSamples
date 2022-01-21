export const populateSidePanel = () => {
  
    var panelArea = document.getElementById('player_side_panel_hook');
            var para2 = document.createElement("P");
            var t2 = document.createTextNode("This is in the panel.");
            para2.appendChild(t2);
            panelArea.appendChild(para2);
};
