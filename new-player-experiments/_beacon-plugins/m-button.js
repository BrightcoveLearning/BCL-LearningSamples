export const detailsPageAddCustomButton = () => {
  window.postMessage({
    event: 'detailsPageAddCustomButton',
    data: {
      title: 'Test Button',
      font_awesome_icon: 'fa fa-info-circle',
      element_id: 'TEST_BTN_ID'
    }
  }, window.location.origin);
};
