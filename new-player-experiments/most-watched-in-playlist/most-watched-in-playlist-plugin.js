videojs.plugin('mostWatchedVideosInPlaylist', function() {

  var myPlayer = this,
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy.php',
      cmsURL = 'https://cms.api.brightcove.com/v1/accounts/',
      myPlayer = this,
      requestData = {},
      mostWatchedVideos = [],
      videoData = [],
      videoObjects = [];
      // set up data for CMS API request
      requestData = setRequestData();
      // make the CMS API request to get matching video IDs
      getMostWatchedVideos(requestData, function (mostWatchedVideos) {
          // extract the needed video data into an array
          videoData = extractVideoData(mostWatchedVideos);
          getVideoData(videoData, function (videoObjects) {
              // add the most watched videos list to the player as a playlist
              myPlayer.playlist(videoObjects);
          });
      });
  /**
   * sets up the data for the API request
   */
  function setRequestData() {
      var endPoint = '',
          accountId = '1752604059001',
          videoName,
          requestURL,
          endPoint,
          requestData = {},
          dataReturned = false;
      requestURL = cmsURL + accountId + '/videos';
      // return the 10 most watched videos
      endPoint = '?sort=-plays_total&limit=10';
      requestData.url = requestURL + endPoint;
      requestData.requestType = 'GET';
      return requestData;
  }

  function getMostWatchedVideos(options, callback) {
      var httpRequest = new XMLHttpRequest(),
          responseRaw,
          parsedData,
          requestParams;
      // set up request data
      requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('POST', proxyURL);
      // set headers
      httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // open and send request
      httpRequest.send(requestParams);
      // response handler
      function getResponse() {
          dataReturned = false;
          try {
              if (httpRequest.readyState === 4) {
                  if (httpRequest.status === 200) {
                      responseRaw = httpRequest.responseText;
                      parsedData = JSON.parse(responseRaw);
                      dataReturned = true;
                  } else {
                      alert('There was a problem with the request. Request returned ' + httpRequest.status);
                  }
              }
          } catch (e) {
              alert('Caught Exception: ' + e);
          }
          if (dataReturned) {
              callback(parsedData);
          }
      }
  }
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
  /**
   * get video objects
   * @param {array} videoIds array of video ids
   * @return {array} videoData array of video objects
   */
  function getVideoData(videoIds, callback) {
      var i = 0,
          iMax = videoIds.length,
          videoObjectsForReturn =  [];
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

});
