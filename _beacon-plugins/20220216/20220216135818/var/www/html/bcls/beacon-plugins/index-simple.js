import { user } from './user.js';
window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
if (event.data.data.slug == '24849-custom-for-plugin') {
          clearAppOverflowDiv();
          populateCustomPage(pageContent);
        }  }
},
  false
);
