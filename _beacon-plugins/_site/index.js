// This is startup JS
import detailsPageAddCustomButton from "./m-button.js";

window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    switch (event.data.event) {
        
      case 'onBeaconPageLoad':
        if (event.data.data.page_type === 'details') {
          detailsPageAddCustomButton();
        }
        break;
      default:
      // code block
    }
  }
},
  false
);