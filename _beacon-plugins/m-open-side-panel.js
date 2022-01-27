export const openSidePanel = () => {
  
  window.postMessage({
    event: 'enablePlayerSidePanel',
    data: {}
  }, window.location.origin);

};
