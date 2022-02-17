const populateCustomPage = (pageContent) => {
  
  var customPageArea = document.getElementById('custom_page_area');
  console.log('customPageArea', customPageArea)
/*   var para = document.createElement("P");
  var t = document.createTextNode("This is in the custom page.");
  para.appendChild(t); */
  customPageArea.insertAdjacentHTML('afterbegin', pageContent);
  
};

export { populateCustomPage };