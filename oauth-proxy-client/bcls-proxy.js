/*
 * bcls-proxy
 * Version: 0.1
 * Author: Robert Crooks
 * Description: Proxies Brightcove API requests, getting an access token, making the call, and returning
 * the response to an iframe on the client page
 * Requirements:
 *   POST your request to solutions.brightcove.com:8002, and target an iframe on your page
 *   Required fields for the body:
 *       client_id // (get from the Brightcove OAuth UI in Studio)
 *       client_secret // (get from the Brightcove OAuth UI in Studio)
 *       url // the full url for the API call you want to make, including parameters
 *       requestType // (optional default = GET) GET | POST | PUT | PATCH | DELETE
 *       requestBody // (optional) request body for calls that submit data
 *
 * Note: this is a sample only, not a supported Brightcove plugin
 * It only accepts requests from brightcove domains
 * If you would like to use the code to build your own proxy, see docs.brightcove.com/en/perform/oauth-api/guides/quick-start.html
 */
var BCLSPROXY = (function () {
    "use strict";
    var http = require("http"),
        request = require("request"),
        // functions
        getFormValues,
        getAccessToken,
        sendRequest;
    /*
     * extract form values from request body
     */
    getFormValues = function (body, callback) {
        // split the request body string into an array
        var valuesArray = body.split("&"),
            options = {},
            max = valuesArray.length,
            i,
            item,
            error = null;
        // default the requestType to GET, other options to null
        options.url = null;
        options.client_id = null;
        options.client_secret = null;
        options.requestBody = null;
        options.requestType = "GET";
        // now split each item into key and value and store in the object
        for (i = 0; i < max; i = i + 1) {
            item = valuesArray[i].split("=");
            options[item[0]] = item[1];
        }
        // data fixes
        // decode the URL
        options.url = decodeURIComponent(options.url);
        // check for required values
        if (options.client_id === null || options.client_secret === null || options.url === null) {
            error = "Error: client_id, client_secret, and url for API request are required!";
        }
        if (error === null) {
            callback(null, options);
        } else {
            callback(error);
        }
    };
    /*
     * get new access_token
     */
    getAccessToken = function (options, callback) {
        // base64 encode the ciient_id:client_secret string for basic auth
        var auth_string = new Buffer(options.client_id + ":" + options.client_secret).toString("base64"),
            bodyObj;
        // send the request for an access token
        request({
            method: 'POST',
            url: 'https://oauth.brightcove.com/v3/access_token',
            headers: {
                "Authorization": "Basic " + auth_string,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'grant_type=client_credentials'
        }, function (error, response, body) {
            // check for errors
            if (error === null) {
                // success: return the access token to the callback
                bodyObj = JSON.parse(body);
                callback(null, bodyObj.access_token);
            } else {
                // fail: return the error from the OAuth service
                callback(error);
            }
        });
    };
    /*
     * sends the request to the targeted API
     */
    sendRequest = function (token, options, callback) {
        // set the API request options
        var requestOptions = {
                method: options.requestType,
                url: options.url,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: options.requestBody
            };
        // send the API request
        request(requestOptions, function (error, response, body) {
            console.log("error", error);
            if (error === null) {
                // success: return the headers and body
                callback(null, response.headers, body);
            } else {
                // fail: return the erro
                callback(error);
            }
        });
    };
    /*
     * Http Server to handle requests
     */
    http.createServer(function (req, res) {
        var body = "";
        console.log("headers", req.headers);
        // this version of this proxy accepts requests only from domains that include "localhost"
        // modify the following line to take requests from other domains
        // or remove the if block to accept requests from any domain (not recommended!)
        if (req.headers.origin.indexOf("localhost") < 0) {
            res.writeHead(500);
            res.end("Your request cannot be processed; this proxy only handles requests originating from a local web server. If you would like to build your own version of this proxy, see http://docs.brightcove.com/en/perform/oauth-api/guides/quick-start.html");
        }
        req.on("data", function (chunk) {
            body += chunk;
        });
        req.on("end", function () {
            // process the request body to extract the data into an object
            getFormValues(body, function (error, options) {
                if (error === null) {
                    // get the access token
                    getAccessToken(options, function (error, token) {
                        if (error === null) {
                            // we have a token; send the API request
                            sendRequest(token, options, function (error, headers, body) {
                                if (error === null) {
                                    console.log("response headers", headers);
                                    var header;
                                    // return whatever headers the API response sent
                                    for (header in headers) {
                                        res.setHeader(header, headers[header]);
                                    }
                                    // optional - prettify JSON responses
                                    if (body.indexOf("{") === 0 || options.url.indexOf("format=json") > -1) {
                                        // prettify JSON
                                        body = JSON.stringify(JSON.parse(body), true, 2);
                                    }
                                        // send the response headers and body from the API request
                                        res.writeHead(200);
                                        res.end(body);
                                } else {
                                    // the API call failed - return the error
                                    res.writeHead(500);
                                    res.end("Your API call was unsuccessful; here is what the server returned: " + error);
                                }
                            });
                        } else {
                            // couldn't get an access token - return the error
                            res.writeHead(500);
                            res.end("There was a problem getting your access token: " + error);
                        }
                    });
                } else {
                    // request did not contain the necessary data - return the error
                    res.writeHead(500);
                    res.end("There was a problem with your request: " + error);
                }
            });
        });
    // change the following line to have the proxy listen for requests on a different port
}).listen(8003);
})();
