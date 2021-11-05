// This is startup JS
window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {


      switch (event.data.event) {
        
        case 'detailsPageExternalButtonWasClicked':
          {
            alert('button was clicked');
          }

        case 'onBeaconPageLoad':
          if (event.data.data.page_type === 'details') {

            window.postMessage({
              event: 'detailsPageAddCustomButton',
              data: {
                title: 'Test Button',
                font_awesome_icon: 'fa fa-info-circle',
                element_id: 'TEST_BTN_ID'
              }
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