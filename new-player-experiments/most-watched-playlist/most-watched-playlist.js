videojs.registerPlugin('mostWatchedPlaylist', function() {
  // +++ Initialize variables and option object for CMS API call +++
  // Data structures for manipulated video data
  var myPlayer = this,
    mostWatchedVideos = [],
    videoData = [],
    videoObjects = [],
    // +++ Build options needed for CMS API request +++
    options = {},
    requestBody = {},
    accountId = "1752604059001",
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    endPoint = "?sort=-plays_total&limit=10";
  options.url = baseURL + accountId + '/videos' + endPoint;
  options.proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php';
  options.requestType = 'GET';

  // +++ Helper Function: Retrieve video objects from video IDs +++
  /**
   * get video objects
   * @param {array} videoIds array of video ids
   * @return {array} videoData array of video objects
   */
  function getVideoData(videoIds, callback) {
    var i = 0,
      iMax = videoIds.length,
      videoObjectsForReturn = [];
    /**
     * makes catalog calls for all video ids in the array
     */
    getVideo();

    function getVideo() {
      if (i < iMax) {
        myPlayer.catalog.getVideo(videoIds[i].id, pushData);
      } else {
        callback(videoObjectsForReturn);
      }
    }

    // +++ Helper Function: Callback function that places video objects into array +++
    /**
     * callback for the catalog calls
     * pushes the returned data object into an array
     * @param {string} error error returned if the call fails
     * @parap {object} video the video object
     */
    function pushData(error, video) {
      videoObjectsForReturn.push(video);
      i++;
      getVideo();
    }
  }

  // +++ Helper Function: Extract video IDs from data CMS API response +++
  /**
   * extract video data from CMS API response
   * @param {array} cmsData the data from the CMS API
   * @return {array} videoData array of video info
   */
  function extractVideoData(cmsData) {
    var i,
      iMax = cmsData.length,
      videoItem,
      videoDataForReturn = [];
    for (i = 0; i < iMax; i++) {
      if (cmsData[i].id !== null) {
        videoItem = {};
        videoItem.id = cmsData[i].id;
        videoDataForReturn.push(videoItem);
      }
    }
    return videoDataForReturn;
  }

  // +++ Make the CMS API request to get matching video IDs +++
  makeRequest(options, function(mostWatchedVideos) {
    var JSONmostWatchedVideos;
    // Convert response string into JSON
    JSONmostWatchedVideos = JSON.parse(mostWatchedVideos);
    // Extract the needed video IDs into an array
    videoData = extractVideoData(JSONmostWatchedVideos);
    // Get video objects based on array of video IDs
    getVideoData(videoData, function(videoObjects) {
      // Add the most watched videos list to the player as a playlist
      myPlayer.playlist(videoObjects);
    });
  });

  // +++ Make actual request to API +++
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
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
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
     * the proxy used here takes the following request body:
     * JSON.strinify(options)
     */
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers if there is a set header line, remove it
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }
});
