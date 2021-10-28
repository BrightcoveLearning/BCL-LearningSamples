// This is startup JS
window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {

      console.log('event: ', event);
      console.log('event.data.data.page_type: ', event.data.data.page_type);
      switch(event.data.event) {
        case 'beforeBeaconPageLoad':
          if (event.data.data.page_type === 'details') {
            console.log('in beforepageload');
            // Call detailsPageAddCustomButton to add a button to details pages
            myAddButton = window.postMessage({
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
          // code block
      }

    } else {
      alert('Invalid origin');
    }
  },
  false
);