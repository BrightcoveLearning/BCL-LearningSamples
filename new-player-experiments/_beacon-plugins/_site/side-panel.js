window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {

      console.log('event type:', event.data.event);
      console.log('event.data.data.page_type:', event.data.data.page_type);
      
      switch (event.data.event) {
        
        case 'onBeaconPageLoad':
          if (event.data.data.page_type === 'player_vod') {
            console.log('trying to add a side panel');
            window.postMessage({
              event: 'enablePlayerSidePanel',
            }, window.location.origin);
          }
          break;
        default:
      }

    } else {
      alert('Invalid origin');
    }
  },
  false
);
// player_side_panel_hook