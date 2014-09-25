var BCLSPROXY = (function () {
  "use strict";

  var http = require("http"),
    request = require("request"),
    // functions
    getFormValues,
    getAccessToken,
    sendRequest;

  getFormValues = function (body, callback) {
  };
  getAccessToken = function (options, callback) {
  };
  sendRequest = function (token, options, callback) {
  };    

  http.createServer(function (req, res) {
    var body = "";
    console.log(req);
    
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
  }).listen(8003);

  console.log("Server running on port 8003");
})();