export const enablePlayerSidePanel = () => {
  
    window.postMessage({
    
    event: 'enablePlayerSidePanel',
    data: {}
  }, window.location.origin);

};
