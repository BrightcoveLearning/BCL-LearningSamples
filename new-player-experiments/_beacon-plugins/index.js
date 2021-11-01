// This is startup JS

window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {


      console.log('event: ', event);
      console.log('event.data.data.page_type: ', event.data.data.page_type);
      console.log('event.data.event: ', event.data.event);
      switch(event.data.event) {
        case 'beforeBeaconPageLoad':
          if (event.data.data.page_type === 'details') {
            console.log('in details page type');
            // Call detailsPageAddCustomButton to add a button to details pages
            window.postMessage({
              event: 'detailsPageAddCustomButton',
              data: {
                title: 'Test Button',
                font_awesome_icon: 'fa fa-info-circle',
                element_id: 'TEST_BTN_ID'
              }
            }, window.location.origin);
          }
          console.log('after postmessage');
          break;
        case 'notlookingforthis':
          console.log('notlookingforthis');
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