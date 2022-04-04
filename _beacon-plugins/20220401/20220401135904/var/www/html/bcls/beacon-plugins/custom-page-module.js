const populateCustomPage = (pageContent) => {
  
  var customPageArea = document.getElementById('custom_page_area');
  customPageArea.insertAdjacentHTML('afterbegin', pageContent);
  <iframe src="https://beacon-help.support.brightcove.com/ott-plugins/index.html" title="Beacon Plugins Index Page"></iframe>
};

export { populateCustomPage };