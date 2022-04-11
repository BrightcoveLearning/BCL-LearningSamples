import { addCustomButtonDetails, addCustomButtonDetailsParams, handleButtonClick } from './button-module.js';
import { populateMidPageDiv, clearMidPageDiv } from './div-mid-page-module.js';
import { populateAppOverflowDiv, clearAppOverflowDiv } from './div-app-overflow-module.js';
import { openSidePanel, populateSidePanel, clearSidePanel, populateSidePanelStadium, populateSidePanelStadiumIframe } from './side-panel-module.js';
import { populateCustomPage, populateStadiumPage } from './custom-page-module.js';
import { pageContent } from './data.js';


window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-west-2.qa.deploys.brightcove.com',
    'https://beacon-web.ott.us-west-2.stage.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    // console.log('event data', event.data.data);
    switch (event.data.event) {
      case 'beforeBeaconPageLoad':
        console.log('beforeBeaconPageLoad Event data: ', event.data.data);
      break;

      case 'detailsPageExternalButtonWasClicked':
        console.log('detailsPageExternalButtonWasClicked Event data: ', event.data.data);
        console.log('button ID', event.data.data.element_id);
        
        if (event.data.data.element_id == 'download-button') {
          handleButtonClick('Download button');
        };
        if (event.data.data.element_id == 'location-button') {
          handleButtonClick('Location button');
        };
      break;

      case 'onPlayerSidePanelDisplay':
        populateSidePanelStadium(event.data.data);
      break;

      case 'onPlayerSidePanelDisappear':
        clearSidePanel();
      break;

      case 'onBeaconPageLoad':
        if (event.data.data.slug == '24849-custom-for-plugin') {
          populateCustomPage(pageContent);
        }
        
        console.log('onBeaconPageLoad Event data: ', event.data.data);
        openSidePanel(); 
        if (event.data.data.page_type == 'details') {
          populateMidPageDiv();
        }
        addCustomButtonDetailsParams('Download', 'fa fa-info-circle', 'download-button');
        addCustomButtonDetailsParams('Location', 'fa fa-info-circle', 'location-button');
        // detailsPageAddCustomButton();
        populateAppOverflowDiv();
      break;
        
      case 'loadedBeaconVideoMetadata':
        console.log('loadedBeaconVideoMetadata Event data: ', event.data.data);
      break;

      case 'onBeaconPageChange':
        console.log('onBeaconPageChange Event data: ', event.data.data);
      break;

      case 'onBeaconPageUnload':
        console.log('onBeaconPageUnload Event data: ', event.data.data);
      break;
    }
  }
},
false
);