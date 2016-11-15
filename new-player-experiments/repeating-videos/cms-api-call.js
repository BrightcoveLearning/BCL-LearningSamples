var BCLS = (function (window, document) {
  var fragment = document.createDocumentFragment(),
    // account stuff
    accountId,
    clientId,
    clientSecret,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/mrss-proxy.php',
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    sort,
    sortDirection = "",
    search,
    limit = 25,
    totalVideos = 0,
    totalCalls = 0,
    callNumber = 0,
    videosArray = [],
    // elements
    account_id = document.getElementById('account_id'),
    client_id = document.getElementById('client_id'),
    client_secret = document.getElementById('client_secret'),
    numberSelect = document.getElementById('numberSelect'),
    searchStr = document.getElementById('searchStr'),
    sortSelect = document.getElementById('sortSelect'),
    directionSelect = document.getElementById('directionSelect'),
    makeLinks = document.getElementById('makeLinks'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    linksDisplay = document.getElementById('linksDisplay'),
    allButtons = document.getElementsByName('button');
  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {String|Number} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === "" || x === null || x === undefined || x === NaN) {
      return false;
    }
    return true;
  }
  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   */
  function getSelectedValue(e) {
    return e.options[e.selectedIndex].value;
  }
  /**
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].setAttribute('disabled', 'disabled');
      allButtons[i].setAttribute('style', 'cursor:not-allowed;');
    }
  }
  /**
   * re-enables all buttons
   */
  function enableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].removeAttribute('disabled');
      allButtons[i].setAttribute('style', 'cursor:pointer;');
    }
  }
  /**
   * sort an array of objects based on an object property
   * @param {array} targetArray - array to be sorted
   * @param {string|number} objProperty - object property to sort on
   * @return sorted array
   */
  function sortArray(targetArray, objProperty) {
    targetArray.sort(function (b, a) {
      var propA = a[objProperty],
        propB = b[objProperty];
      // sort ascending; reverse propA and propB to sort descending
      if (propA < propB) {
        return -1;
      } else if (propA > propB) {
        return 1;
      } else {
        return 0;
      }
    });
    return targetArray;
  }

  function processSources(sources) {
    var i = sources.length;
    // remove non-MP4 sources
    while (i > 0) {
      i--;
      if (sources[i].container !== 'MP4') {
        sources.splice(i, 1);
      } else if (sources[i].hasOwnProperty('stream_name')) {
        sources.splice(i, 1);
      }
    }
    // sort sources by encoding rate
    sortArray(sources, 'encoding_rate');
    // return the first item (highest bitrate)
    return sources[0];
  }

  function addItems() {
    var i,
      iMax,
      video,
      pubdate,
      videoURL,
      linkTable = document.createElement('table'),
      linkHead = document.createElement('thead'),
      linkBody = document.createElement('tbody'),
      linkTh,
      linkTd,
      linkTr,
      content,
      linkA;
    fragment.appendChild(linkTable);
    linkTable.appendChild(linkHead);
    linkTable.appendChild(linkBody);
    // create the header row
    linkTr = document.createElement('tr');
    linkTh = document.createElement('th');
    content = document.createTextNode('Video id');
    linkTh.appendChild(content);
    linkTr.appendChild(linkTh);
    linkTh = document.createElement('th');
    content = document.createTextNode('Name');
    linkTh.appendChild(content);
    linkTr.appendChild(linkTh);
    linkTh = document.createElement('th');
    content = document.createTextNode('Date Created');
    linkTh.appendChild(content);
    linkTr.appendChild(linkTh);
    linkTh = document.createElement('th');
    content = document.createTextNode('Download Link');
    linkTh.appendChild(content);
    linkTr.appendChild(linkTh);
    linkHead.appendChild(linkTr);
    // add the body rows
    if (videosArray.length > 0) {
      iMax = videosArray.length;
      for (i = 0; i < iMax; i += 1) {
        video = videosArray[i];
        // video may not have a valid source
        if (isDefined(video.source) && isDefined(video.source.src)) {
          videoURL = encodeURI(video.source.src.replace(/&/g, '&amp;'));
        } else {
          videoURL = "";
        }
        linkTr = document.createElement('tr');
        linkTd = document.createElement('td');
        content = document.createTextNode(video.id);
        linkTd.appendChild(content);
        linkTr.appendChild(linkTd);
        linkTd = document.createElement('td');
        content = document.createTextNode(video.name);
        linkTd.appendChild(content);
        linkTr.appendChild(linkTd);
        linkTd = document.createElement('td');
        content = document.createTextNode(video.created_at);
        linkTd.appendChild(content);
        linkTr.appendChild(linkTd);
        linkTd = document.createElement('td');
        if (isDefined(videoURL)) {
          linkA = document.createElement('a');
          linkA.setAttribute('href', videoURL);
          linkA.setAttribute('target', '_blank');
          content = document.createTextNode(videoURL);
          linkA.appendChild(content);
          linkTd.appendChild(linkA);
        } else {
          content = document.createTextNode('No downloadable rendition');
          linkTd.appendChild(content);
        }
        linkTr.appendChild(linkTd);
        linkBody.appendChild(linkTr);
      }
    }
    logger.textContent = 'Finished!';
    linksDisplay.appendChild(fragment);
    enableButtons();
  }
  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function setRequestData(id) {
    var endPoint = '',
      requestData = {};
    // disable buttons to prevent a new request before current one finishes
    disableButtons();
    switch (id) {
    case 'getCount':
      endPoint = accountId + '/counts/videos?sort=' + sort;
      if (isDefined(search)) {
        endPoint += '&q=' + search;
      }
      requestData.url = baseURL + endPoint;
      requestData.requestType = 'GET';
      apiRequest.textContent = requestData.url;
      getMediaData(requestData, id);
      break;
    case 'getVideos':
      endPoint = accountId + '/videos?sort=' + sort + '&limit=' + j + '&offset=' + limit * callNumber;
      if (isDefined(search)) {
        endPoint += '&q=' + search;
      }
      requestData.url = baseURL + endPoint;
      requestData.requestType = 'GET';
      apiRequest.textContent = requestData.url;
      getMediaData(requestData, id);
      break;
    case 'getVideoSources':
      var i,
        iMax = videosArray.length;
      callback = function (sources) {
        if (sources.length > 0) {
          // get the best MP4 rendition
          var source = processSources(sources);
          videosArray[callNumber].source = source;
        } else {
          // video has no sources
          videosArray[callNumber].source = null;
        }
        callNumber++;
        if (callNumber < iMax) {
          setRequestData('getVideoSources');
        } else {
          // remove videos with no sources
          i = videosArray.length;
          while (i > 0) {
            i--;
            console.log('videosArray[i]', videosArray[i]);
            if (!isDefined(videosArray[i].source)) {
              console.log('i', i);
              videosArray.splice(i, 1);
            }
          }
          addItems();
        }
      };
      endPoint = accountId + '/videos/' + videosArray[callNumber].id + '/sources';
      requestData.url = baseURL + endPoint;
      requestData.requestType = 'GET';
      apiRequest.textContent = requestData.url;
      logger.textContent = 'Getting sources for video ' + videosArray[callNumber].name;
      getMediaData(requestData, id, callback);
      break;
    }
  }
  /**
   * send API request to the proxy
   * @param  {Object} requestData options for the request
   * @param  {String} requestID the type of request = id of the button
   * @param  {Function} [callback] callback function
   */
  function getMediaData(options, requestID, callback) {
    var httpRequest = new XMLHttpRequest(),
      responseRaw,
      parsedData,
      requestParams,
      dataString,
      sources,
      // response handler
      getResponse = function () {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
              // check for completion
              if (requestID === 'getCount') {
                responseRaw = httpRequest.responseText;
                parsedData = JSON.parse(responseRaw);
                // set total videos
                totalVideos = parsedData.count;
                totalCalls = Math.ceil(totalVideos / limit);
                logger.textContent = 'Total videos: ' + totalVideos;
                setRequestData('getVideos');
              } else if (requestID === 'getVideos') {
                if (httpRequest.responseText === '[]') {
                  // no video returned
                  alert('no video returned');
                }
                responseRaw = httpRequest.responseText;
                parsedData = JSON.parse(responseRaw);
                videosArray = videosArray.concat(parsedData);
                callNumber++;
                if (callNumber < totalCalls) {
                  logger.textContent = 'Getting video set ' + callNumber;
                  setRequestData('getVideos');
                } else {
                  logger.textContent = 'Video data for ' + totalVideos + ' retrieved; getting sources...';
                  callNumber = 0;
                  setRequestData('getVideoSources');
                }
              } else if (requestID === 'getVideoSources') {
                if (httpRequest.responseText === '[]') {
                  // no video returned
                  sources = [];
                  callback(sources);
                } else {
                  responseRaw = httpRequest.responseText;
                  sources = JSON.parse(responseRaw);
                  // increment offset
                  callback(sources);
                }
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          }
        } catch (e) {
          alert('Caught Exception: ' + e);
        }
      };
    // set up request data
    requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
    // only add client id and secret if both were submitted
    if (isDefined(clientId) && isDefined(clientSecret)) {
      requestParams += '&client_id=' + clientId + '&client_secret=' + clientSecret;
    }
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // open and send request
    httpRequest.send(requestParams);
  }

  function init() {
    // event handlers
    makeLinks.addEventListener('click', function () {
      var numVideos;
      // get the inputs
      clientId = client_id.value;
      clientSecret = client_secret.value;
      // only use entered account id if client id and secret are entered also
      if (isDefined(clientId) && isDefined(clientSecret)) {
        if (isDefined(account_id.value)) {
          accountId = account_id.value;
        } else {
          window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
          clientId = '';
          clientSecret = '';
          accountId = '1752604059001';
        }
      } else {
        accountId = '1752604059001';
      }
      sort = getSelectedValue(sortSelect);
      sortDirection = getSelectedValue(directionSelect);
      if (isDefined(sortDirection)) {
        sort = sortDirection + sort;
      }
      search = searchStr.value;
      numVideos = getSelectedValue(numberSelect);
      // add title and description
      // if all videos wanted, get count; otherwise get videos
      if (numVideos === 'all') {
        // we need to get the count
        setRequestData('getCount');
      } else {
        totalVideos = parseInt(numVideos);
        totalCalls = Math.ceil(numVideos / limit);
        logger.textContent = 'Total videos to retrieve: ' + totalVideos;
        setRequestData('getVideos');
      }
    });
    linksDisplay.addEventListener('click', function () {
      linksDisplay.select();
    });
  }
  init();
})(window, document);
