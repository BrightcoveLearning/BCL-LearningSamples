// This is startup JS
window.addEventListener("message",
  (onBeaconPageChange) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {
      console.log('event: ', event);

      // Call detailsPageAddCustomButton to add a button to details pages
      myAddButton = window.postMessage({
        event: 'detailsPageAddCustomButton',
        data: {
          title: 'Test Button',
          font_awesome_icon: 'fa fa-info-circle',
          element_id: 'TEST_BTN_ID'
        }
      }, window.location.origin);

    } else {
      alert('Invalid origin');
    }
  },
  false
);