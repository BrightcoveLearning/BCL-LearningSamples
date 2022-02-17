const populateCustomPage = () => {
  
  var customPageArea = document.getElementById('#custom_page_area');
  var para2 = document.createElement("P");
  var t2 = document.createTextNode("This is beacon-web-app-overflow.");
  para2.appendChild(t2);
  customPageArea.appendChild(para2);
  
};


export { populateCustomPage };