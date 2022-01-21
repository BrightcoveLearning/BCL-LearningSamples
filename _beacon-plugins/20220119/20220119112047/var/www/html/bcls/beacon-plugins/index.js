import { detailsPageAddCustomButton } from './m-button.js';
window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    
    detailsPageAddCustomButton();

    /* window.postMessage({
    
    event: 'detailsPageAddCustomButton',
    data: {
      title: 'Test Button',
      font_awesome_icon: 'fa fa-info-circle',
      element_id: 'TEST_BTN_ID'
    }
  }, window.location.origin); */

  }
},
  false
);