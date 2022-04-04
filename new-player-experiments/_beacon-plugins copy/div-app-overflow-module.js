const populateAppOverflowDiv = () => {
  
  var webAppOverflow = document.getElementById('beacon-web-app-overflow');
  var para2 = document.createElement("P");
  var t2 = document.createTextNode("This is beacon-web-app-overflow.");
  para2.appendChild(t2);
  webAppOverflow.appendChild(para2);
  
};


const clearAppOverflowDiv = () => {
  
  var webAppOverflow = document.getElementById('beacon-web-app-overflow');
  webAppOverflow.innerHTML = '';
  
};

export { populateAppOverflowDiv, clearAppOverflowDiv };