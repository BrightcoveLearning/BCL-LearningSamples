import { addCustomButtonDetails, addCustomButtonDetailsParams, handleButtonClick } from './button-module.js';
import { populateMidPageDiv, clearMidPageDiv } from './div-mid-page-module.js';
import { appOverflowDiv } from './m-div-app-overflow.js';
import { openSidePanel, populateSidePanel, clearSidePanel } from './side-panel-module.js';

//import { data } from './m-data.js';


window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    openSidePanel();
    switch (event.data.event) {
      
      case 'detailsPageExternalButtonWasClicked':
        handleButtonClick();
        break;
        
      case 'onPlayerSidePanelDisplay':
        populateSidePanel();
        break;
        
      case 'onPlayerSidePanelDisappear':
        clearSidePanel();
        break;
        
      case 'onBeaconPageLoad':
        //data();
        //console.log('panelData value', panelData);
        populateMidPageDiv();
        addCustomButtonDetailsParams('Test Button', 'fa fa-info-circle', 'TEST_BTN_ID');
        //detailsPageAddCustomButton();
        appOverflowDiv();
      break;

    }

  }
},
  false
);