const populateCustomPage = (pageContent) => {
  
  var customPageArea = document.getElementById('custom_page_area');
  console.log('customPageArea', customPageArea)
  customPageArea.insertAdjacentHTML('afterbegin', pageContent);
  
};

export { populateCustomPage };