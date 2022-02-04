import { addCustomButtonDetails, handleButtonClick } from './button-demo-module.js';

window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-west-2.qa.deploys.brightcove.com',
    'https://beacon-web.ott.us-west-2.stage.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    switch (event.data.event) {
      
      case 'detailsPageExternalButtonWasClicked':
        console.log('button ID', event.data.data.element_id);
        if (event.data.data.element_id == 'download-button') {
          handleButtonClick('Download button'); 
        };
        if (event.data.data.element_id == 'location-button') {
          handleButtonClick('Location button');
        };
        break;
        
      case 'onBeaconPageLoad':
        addCustomButtonDetailsParams('Download', 'fa fa-info-circle', 'download-button');
        addCustomButtonDetailsParams('Location', 'fa fa-info-circle', 'location-button');
        break;
    }

  }
},
  false
);