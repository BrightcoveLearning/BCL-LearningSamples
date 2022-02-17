import { addCustomButtonDetails, handleButtonClick } from './button-demo-module.js';

window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-west-2.qa.deploys.brightcove.com',
    'https://beacon-web.ott.us-west-2.stage.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    switch (event.data.event) {
      case 'onBeaconPageLoad':
        addCustomButtonDetails('Download', 'fa fa-info-circle', 'download-button');
        addCustomButtonDetails('Location', 'fa fa-info-circle', 'location-button');
        break;
      
      case 'detailsPageExternalButtonWasClicked':
        if (event.data.data.element_id == 'download-button') {
          handleButtonClick('Download'); 
        };
        if (event.data.data.element_id == 'location-button') {
          handleButtonClick('Location');
        };
        break;
        // testing user events
        case 'userDidSignIn':
            alert('User Sign in');
            console.log(event.data)
        break;
       
        case 'userDidRegister':
            alert('User Register');
            console.log(event.data)
        break;
        
        case 'userDidSignOut':
            alert('User Sign Out');
            console.log(event.data)
        break;
    }

  }
},
  false
);