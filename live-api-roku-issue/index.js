var BCLS = ( function (window, document) {
  var live_key       = document.getElementById('live_key'),
    regionSelect     = document.getElementById('regionSelect'),
    apiResponse      = document.getElementById('apiResponse'),
    sendButton       = document.getElementById('sendButton'),
    writePropsButton = document.getElementById('writePropsButton'),
    configNames      = document.getElementById('configNames'),
    rokuRadioButtons = document.getElementById('rokuRadioButtons'),
    notRokuRadioButtons = document.getElementById('notRokuRadioButtons'),
    proxyURL         = 'https://solutions.brightcove.com/bcls/bcls-proxy/live-proxy.php',
    regions          = ['us-west-2', 'us-east-1', 'ap-northeast-1', 'ap-southeast-1',  'ap-southeast-2', 'ap-south-1', 'eu-central-1', 'eu-west-1', 'sa-east-1'],
    apiKey           = '',
    body             = '',
    requestURL       = 'https://api.bcovlive.io/v1/jobs',
    fragment         = document.createDocumentFragment(),
    option,
    i,
    iMax,
    responseDecoded,
    numOfAdConfigs,
    notRokuIDValue,
    rokuIDValue;

  // build select options
  iMax = regions.length;
  for (i = 0; i < iMax; i++) {
    option = document.createElement('option');
    option.setAttribute('value', regions[i]);
    option.textContent = regions[i];
    if (regions[i] === 'us-west-2') {
      option.setAttribute('selected', 'selected');
    }
    fragment.appendChild(option);
  }
  regionSelect.appendChild(fragment);

  // event handlers

  sendButton.addEventListener('click', function() {
    if (isDefined(live_key.value)) {
      createRequest();
    } else {
      alert('You must provide a Live API Key');
    }
  });

  writePropsButton.addEventListener('click', function () {
    var rokuButtonList = document.getElementsByName('rokuID'),
      notRokuButtonList = document.getElementsByName('notRokuID');
    for (var i = 0; i < numOfAdConfigs; i++) {
      if (rokuButtonList[i].checked) {
        rokuIDValue = rokuButtonList[i].value
        console.log('rokuIDValue', rokuIDValue);
      }
    }
    for (var i = 0; i < numOfAdConfigs; i++) {
      if (notRokuButtonList[i].checked) {
        notRokuIDValue = notRokuButtonList[i].value
        console.log('notRokuIDValue', notRokuIDValue);
      }
    }
  })



  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {Object} object containing the `value`, text, and selected `index`
   */
  function getSelectedValue(e) {
      var selected = e.options[e.selectedIndex],
          val = selected.value,
          txt = selected.textContent,
          idx = e.selectedIndex;
      return {
          value: val,
          text: txt,
          index: idx
      };
  }

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {*} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
      if ( x === '' || x === null || x === undefined) {
          return false;
      }
      return true;
  }

  /*
   * tests to see if a string is json
   * @param {String} str string to test
   * @return {Boolean}
   */
  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

  /**
   * prepares the api request and handles the response
   */
/*     function createRequest() {
      var options = {},
        responseDecoded,
        playlist;
      body.region = getSelectedValue(regionSelect).value;
      options.url = requestURL;
      reqBody.textContent = JSON.stringify(body);
      options.requestBody = JSON.stringify(body);
      options.requestType = 'POST';
      options.apiKey = live_key.value;
      makeRequest(options, function(response) {
        if (isJson(response)) {
          responseDecoded = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(responseDecoded, null, '  ');
          stream_url.textContent = responseDecoded.stream_url;
console.log('playback_url', responseDecoded.playback_url);
          playback_url.textContent = responseDecoded.playback_url;
          playback_url_dvr.textContent = responseDecoded.playback_url_dvr;
        } else {
          apiResponse.textContent = response;
        }
      });
    } */

    
    function buildAdConfigCheckboxes() {
      for (let i = 0; i <= numOfAdConfigs - 1; i++) {
        let label = document.createElement("label");
        label.innerText = responseDecoded[i].application_description;
        let input = document.createElement('input');
        input.value = responseDecoded[i].application_id;
        input.type = 'radio';
        input.name = 'rokuID'
        label.prepend(input);
        rokuRadioButtons.appendChild(label);
      }
      for (let i = 0; i <= numOfAdConfigs - 1; i++) {
        let label = document.createElement("label");
        label.innerText = responseDecoded[i].application_description;
        let input = document.createElement('input');
        input.value = responseDecoded[i].application_id;
        input.type = 'radio';
        input.name = 'notRokuID'
        label.prepend(input);
        notRokuRadioButtons.appendChild(label);
      }
    }

    function createRequest() {
      var options = {},
        i;
      body.region = getSelectedValue(regionSelect).value;
      options.url = 'https://api.bcovlive.io/v1/ssai/applications';
      options.requestBody = '';
      options.requestType = 'GET';
      options.apiKey = live_key.value;
      console.log('options in create', options);
      makeRequest(options, function(response) {
        if (isJson(response)) {
          responseDecoded = JSON.parse(response);
          console.log('responseDecoded', responseDecoded);
          numOfAdConfigs = responseDecoded.length;
          buildAdConfigCheckboxes();
/*           apiResponse.textContent = JSON.stringify(responseDecoded, null, '  ');
          stream_url.textContent = responseDecoded.stream_url;
          playback_url.textContent = responseDecoded.playback_url;
          playback_url_dvr.textContent = responseDecoded.playback_url_dvr;
 */        } else {
          apiResponse.textContent = response;
        }
      });
    }


  /**
   * send API request to the proxy
   * @param  {Object} options options for the request
   * @param  {String} requestID the type of request = id of the button
   * @param  {Function} [callback] callback function
   */
  function makeRequest(options, callback) {
    var httpRequest = new XMLHttpRequest(),
      responseRaw,
      parsedData,
      requestParams,
      dataString,
      renditions,
      field,
      i = 0,
      iMax,
      // response handler
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
              // check for completion
              responseRaw = httpRequest.responseText;
//console.log('responseRaw', responseRaw);
              callback(responseRaw);
            }
          }
        } catch (e) {
          alert('Caught Exception: ' + e);
        }
      };
console.log('options', options);
    // set up request data
    requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType + '&apiKey=' + options.apiKey + '&requestBody=' + options.requestBody;
    console.log('requestParams: ', requestParams);
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // open and send request
    httpRequest.send(requestParams);
  }

})(window, document);