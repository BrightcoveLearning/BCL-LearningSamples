var options = {
    "account_id": "1752604059001",
    "proxyURL": "https://solutions.brightcove.com/bcls/bcls-proxy/alltime-views-proxy.php"
};

videojs('bcls_alltimePlaysPlayer').ready(function() {
    var myPlayer = this,
    element,
    txt,
    account_id = options.account_id,
    video_id,
    alltimeViews,
    videoElement = document.getElementById('bcls_alltimePlaysPlayer');

    myPlayer.one('loadedmetadata', function() {
        element = document.createElement('p');
        element.setAttribute('id', 'bcls_alltimeViews');
        video_id = myPlayer.mediainfo.id;
    });

    /**
     * formats an integer by adding commas for thousands separators
     * @param  {Integer} x Number to format
     * @return {String}   The formatted number
     */
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    /**
     * createRequest sets up requests, send them to makeRequest(), and handles responses
     * @param  {string} type the request type
     */
    function createRequest(type) {
        var requestOptions   = {},
            responseDecoded,
            i,
            iMax,
            el,
            txt;

        // set credentials
        requestOptions.proxyURL = options.proxyURL;
        requestOptions.url      = 'https://analytics.api.brightcove.com/v1/alltime/accounts/' + account_id + '/videos/' + video_id;
        makeRequest(requestOptions, function(response) {
            responseDecoded = JSON.parse(response);

        });
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
    }

});
