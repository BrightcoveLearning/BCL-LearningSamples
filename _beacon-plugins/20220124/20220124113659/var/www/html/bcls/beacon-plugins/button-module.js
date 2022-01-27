const addCustomButtonDetails = () => {
  
  window.postMessage({
    event: 'detailsPageAddCustomButton',
    data: {
      title: 'Test Button',
      font_awesome_icon: 'fa fa-info-circle',
      element_id: 'TEST_BTN_ID'
    }
  }, window.location.origin);

};


const addCustomButtonDetailsParams = (pTitle, pFont, pID) => {
  
  window.postMessage({
    event: 'detailsPageAddCustomButton',
    data: {
      title: pTitle,
      font_awesome_icon: pFont,
      element_id: pID
    }
  }, window.location.origin);

};


const handleButtonClick = () => {
  
  alert('button was clicked');

};

export { addCustomButtonDetails, handleButtonClick };