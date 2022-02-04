const addCustomButtonDetails = (pTitle, pIcon, pID) => {
  
  window.postMessage({
    event: 'detailsPageAddCustomButton',
    data: {
      title: pTitle,
      font_awesome_icon: pIcon,
      element_id: pID
    }
  }, window.location.origin);

};

const handleButtonClick = (buttonString) => {

  alert('button was clicked ' + buttonString);

};

export { addCustomButtonDetails, addCustomButtonDetailsParams, handleButtonClick };