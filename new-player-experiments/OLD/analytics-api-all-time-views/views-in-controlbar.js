videojs.registerPlugin('viewsInControlbar', function () {
  var myPlayer = this,
    viewsObject = [],
    options = [];
    options.requestType = 'GET',
    options.proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy.php',
    options.requestBody = '';
  // Wait for loadstart event so mediainfo is populated
  // and the video ID and account ID can be retrieved
  myPlayer.on('loadstart', function () {
    // +++ Setup for video views Analytics API request +++
    var videoID = myPlayer.mediainfo.id,
      accountID = myPlayer.mediainfo.accountId;
    // Build the Analytics API endpoint
    options.url = 'https://analytics.api.brightcove.com/v1/alltime/accounts/' + accountID + '/videos/' + videoID;
    // +++ Make the request to the Analytics API +++
    // Extract views from data returned by Analytics API
    makeRequest(options, function (viewsRaw) {
      var viewsCount;
      // Remove console.log command for production code
      console.log('viewsRaw', viewsRaw);
      viewsObject = JSON.parse(viewsRaw);
      console.log('viewsObject', viewsObject);
      viewsCount = viewsObject.alltime_video_views;
      console.log('views', viewsCount);
      // Call function to place data in controlbar
      placeCountInControlbar(viewsCount);
    });
  });
});
// +++ Build and place count in controlbar +++
/**
 * Dynamically build a div that is then
 * placed in the controlbar's spacer element
 */
function placeCountInControlbar(viewsCount) {
  var spacer,
    newElement = document.createElement('div');
  //Place data in div
  newElement.innerHTML = "Total Views: " + viewsCount;
  //Get the spacer in the controlbar
  spacer = document.getElementsByClassName('vjs-spacer')[0];
  //Right justify content in the spacer and add top margin
  spacer.setAttribute('style', 'justify-content: flex-end; margin-top: 10px');
  //Add the dynacmially built div to the spacer in the controlbar
  spacer.appendChild(newElement);
}
/**
 * send API request to the proxy
 * @param  {Object} options for the request
 * @param  {String} options.url the full API request URL
 * @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
 * @param  {String} options.proxyURL proxyURL to send the request to
 * @param  {String} options.client_id client id for the account (default is in the proxy)
 * @param  {String} options.client_secret client secret for the account (default is in the proxy)
 * @param  {JSON} [options.requestBody] Data to be sent in the request body in the form of a JSON string
 * @param  {Function} [callback] callback function that will process the response
 */
// +++ Standard functionality for Analytics API call +++
function makeRequest(options, callback) {
  var httpRequest = new XMLHttpRequest(),
    response,
    requestParams,
    dataString,
    proxyURL = options.proxyURL,
    /**
     * set up request data
     * the proxy used here takes the following params:
     * url - the full API request (required)
     * requestType - the HTTP request type (default: GET)
     * clientId - the client id (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
     * clientSecret - the client secret (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
     * requestData - request body for write requests (optional JSON string)
     */
    requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
  // only add client id and secret if both were submitted
  if (options.client_id && options.client_secret) {
    requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
  }
  // add request data if any
  if (options.requestData) {
    requestParams += '&requestBody=' + options.requestBody;
  }
  console.log('requestParams', requestParams);
  // set response handler
  httpRequest.onreadystatechange = getResponse;
  // open the request
  httpRequest.open('POST', proxyURL);
  // set headers
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // open and send request
  httpRequest.send(requestParams);
  // response handler
  // +++ Return video view count +++
  function getResponse() {
    try {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.status === 204) {
          response = httpRequest.responseText;
          // some API requests return '{null}' for empty responses - breaks JSON.parse
          if (response === '{null}') {
            response = null;
          }
          // return the response
          callback(response);
        } else {
          alert('There was a problem with the request. Request returned ' + httpRequest.status);
        }
      }
    } catch (e) {
      alert('Caught Exception: ' + e);
    }
  };
}
