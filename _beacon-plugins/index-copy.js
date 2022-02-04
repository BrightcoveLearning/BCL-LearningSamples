// This is startup JS
window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    switch (event.data.event) {
        
      case 'onBeaconPageLoad':
        window.postMessage({
          event: 'enablePlayerSidePanel',
          data: {}
        }, window.location.origin);
        break;
      default:
      
    }
  }
},
  false
);