//this is startup JS
window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ]
    if (originsAllowed.includes(event.origin)) {
      console.log('event: ', event);
      getAddLearnMoreButtonMessage = () => ({
        event: POST_EVENT_TYPE.detailsPageAddCustomButton,
        data: {
          title: 'My Test Button',
          font_awesome_icon: "fa fa-info-circle",
          element_id: LEARN_MORE_BTN_ID,
        },
      });
    } else {
      alert('Invalid origin');
    }
  },
  false
);
