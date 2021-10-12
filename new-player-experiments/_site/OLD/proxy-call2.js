/**
 * createRequest sets up requests, send them to makeRequest(), and handles responses
 * @param  {string} type the request type
 */
function createRequest(type) {
    var options   = {},
        ipBaseURL = 'https://ingestion.api.brightcove.com/v1/accounts/' + account.value,
        diBaseURL = 'https://ingest.api.brightcove.com/v1/accounts/' + account.value,
        endpoint,
        responseDecoded,
        i,
        iMax,
        el,
        txt;

    // set credentials
    options.client_id     = cid.value;
    options.client_secret = secret.value;

    switch (type) {
        case 'getProfiles':
            options.proxyURL    = './profiles-proxy.php';
            endpoint            = '/profiles';
            options.url         = ipBaseURL + endpoint;
            options.requestType = 'GET';
            makeRequest(options, function(response) {
                responseDecoded = JSON.parse(response);
                if (Array.isArray(responseDecoded)) {
                    // remove existing options
                    iMax = profiles.length;
                    for (i = 0; i < iMax; i++) {
                        profiles.remove(i);
                    }
                    // add new options
                    iMax = responseDecoded.length;
                    for (i = 0; i < iMax; i++) {
                        el = document.createElement('option');
                        el.setAttribute('value', responseDecoded[i].name);
                        txt = document.createTextNode(responseDecoded[i].name);
                        el.appendChild(txt);
                        profiles.appendChild(el);
                    }
                }
            });
            break;
        // additional cases
        default:
            console.log('Should not be getting to the default case - bad request type sent');
            break;
    }
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
        proxyURL    = options.proxyURL,
        // response handler
        getResponse = function() {
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
     * requestBody - request body for write requests (optional JSON string)
     */
    requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
    // only add client id and secret if both were submitted
    if (options.client_id && options.client_secret) {
        requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
    }
    // add request data if any
    if (options.requestBody) {
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
