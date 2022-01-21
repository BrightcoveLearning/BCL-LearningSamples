import { detailsPageAddCustomButton } from './m-button.js'
import { handleButtonClick } from './m-button-click-handler.js'
import { openSidePanel } from './m-open-side-panel.js'
import { mid-page-div } from './m-div-details-mid-page.js'

window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    
    openSidePanel();
    midPageDiv();

    switch (event.data.event) {
      
      case 'detailsPageExternalButtonWasClicked':
          {
            handleButtonClick();
          }
      
      case 'onBeaconPageLoad':
        detailsPageAddCustomButton();

        break;
      default:
    }

  }
},
  false
);