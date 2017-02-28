videojs.plugin('viewsInControlbar', function() {
  var myPlayer = this,
    options =[],
    viewsCount;
    options.requestType='GET',
    options.proxyURL = 'http://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy.php',
    options.requestBody = '',
    options.callback = '',
    viewsObject = [];

    myPlayer.on('loadstart',function(){
      console.log('mediainfo', myPlayer.mediainfo);
      videoID = mediainfo.id;
      options.url = 'https://analytics.api.brightcove.com/v1/alltime/accounts/1752604059001/videos/' + videoID,
      makeRequest(options, function(viewsRaw){
        console.log('viewRaw', viewsRaw);
        viewsObject = JSON.parse(viewsRaw);
        console.log('viewsObject',viewsObject);
        viewsCount = viewsObject.alltime_video_views;
        console.log('views',viewsCount);
        placeCountInControlbar();
      });
    })



  function placeCountInControlbar(){
    var spacer,
      newElement = document.createElement('div');
    newElement.innerHTML = "Total Views: " + viewsCount;
    spacer = document.getElementsByClassName('vjs-spacer')[0];
    spacer.setAttribute('style', 'justify-content: flex-end; margin-top: 10px');
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
  function makeRequest(options, callback) {
    var httpRequest = new XMLHttpRequest(),
      response,
      requestParams,
      dataString,
      proxyURL = options.proxyURL,
      // response handler
      getResponse = function () {
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
  }
});
