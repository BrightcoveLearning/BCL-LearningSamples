const populateCustomPage = (pageContent) => {
  
  var customPageArea = document.getElementById('custom_page_area');
  customPageArea.insertAdjacentHTML('afterbegin', pageContent);
  
};

export { populateCustomPage };