const populateCustomPage = (pageContent) => {
  
  var customPageArea = document.getElementById('custom_page_area');
  customPageArea.insertAdjacentHTML('afterbegin', pageContent);

};

const populateStadiumPage = (eventObj) => {
  console.log('*** enablePlayerSidePanel eventObj***: ', eventObj);
  var panelArea = document.getElementById('player_side_panel_hook');
  var content = '<h3>This is a Custom Page</h3>'
    + '<br><br>{<br>'
    + '<iframe src="https://playtherally.com/overlay/sbgistadium/ballyrally/ballyrally"></iframe>';
  panelArea.insertAdjacentHTML('afterbegin', content);
};



export { populateCustomPage, populateStadiumPage };