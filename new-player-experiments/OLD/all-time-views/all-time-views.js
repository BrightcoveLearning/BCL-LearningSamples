videojs.plugin('alltimeViews', function(options) {
  var player = this,
    el,
    txt,
    video_id,
    alltimeViewsEl,
    videoElement = document.getElementById('bcls_alltimePlaysPlayer'),
    account_id = videoElement.getAttribute('data-account'),

    // listener for the first video load
    player.one('loadedmetadata', function() {
      // +++ Create the element to hold the video views +++
      el = document.createElement('p');
      el.setAttribute('id', 'bcls_alltimeViews');
      el.setAttribute('style', 'font-weight:bold;');
      if (options.hasPlaylist) {
        var playlistEl = document.getElementById('bcls_alltimePlaysPlaylist');
        playlistEl.insertAdjacentElement('afterend', el);
      } else {
        videoElement.insertAdjacentElement('afterend', el);
      }
      alltimeViewsEl = document.getElementById('bcls_alltimeViews');


      // +++ Get the current video id from mediainfo then start process to get views count +++
      video_id = player.mediainfo.id;
      // launch the Analytics API request to get the alltime video views
      createRequest();


      // +++ Set listener for future requests +++
      player.on('loadedmetadata', function() {
        // Clear element where count is shown
        alltimeViewsEl.textContent = '';
        // get the current video id from mediainfo
        video_id = player.mediainfo.id;
        // launch the Analytics API request to get the alltime video views
        createRequest();
      });
    });

  /**
   * formats an integer by adding commas for thousands separators
   * @param  {Integer} x Number to format
   * @return {String}   The formatted number
   */
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  // +++ Prepare information for request to proxy/Analytics API +++
  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest() {
    var requestOptions = {},
      responseDecoded;

    // set the proxy url
    requestOptions.proxyURL = options.proxyURL;
    // set the Analytics API request
    requestOptions.url = 'https://analytics.api.brightcove.com/v1/alltime/accounts/' + account_id + '/videos/' + video_id;
    console.log('requestOptions', requestOptions);
    // send the request and handle the response
    makeRequest(requestOptions, function(response) {
      // parse the response
      responseDecoded = JSON.parse(response);
      // should always get a response, but just in case...
      if (responseDecoded && responseDecoded.alltime_video_views) {
        // write the views to the UI
        alltimeViewsEl.textContent = numberWithCommas(responseDecoded.alltime_video_views) + ' views';
      } else {
        alltimeViewsEl.textContent = 'All-time views for this video are not available';
      }
    });
  }


  // +++ Make actual call to proxy/Analytics API +++
  /**
   * sends Brightcove API requests to a server-side proxy
   * @param  {Object} requestOptions for the request
   * @param  {String} requestOptions.url the full API request URL
   * @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
   * @param  {String} requestOptions.proxyURL proxyURL to send the request to
   * @param  {Function} [callback] callback function that will process the response
   */
  function makeRequest(requestOptions, callback) {
    var httpRequest = new XMLHttpRequest(),
      response,
      requestParams,
      proxyURL = requestOptions.proxyURL,
      // response handler
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
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
    requestParams = 'url=' + encodeURIComponent(requestOptions.url) + '&requestType=GET';
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
