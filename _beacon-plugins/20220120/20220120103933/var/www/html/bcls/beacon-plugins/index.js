import { detailsPageAddCustomButton } from './m-button.js'
import { handleButtonClick } from './m-button-click-handler.js'
import { openSidePanel } from './m-open-side-panel.js'
import { midPageDiv } from './m-div-mid-page.js'
import { appOverflowDiv } from './m-div-app-overflow.js'


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
      
      case 'onBeaconPageLoad':
        midPageDiv();
        detailsPageAddCustomButton();
        appOverflowDiv();
        
      break;
      default:
    }

  }
},
  false
);