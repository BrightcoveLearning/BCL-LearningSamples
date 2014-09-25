bcls-proxy.js
=============

Proxy for Brightcove RESTful APIs

This proxy handles requests for Brightcove APIs that use OAuth2 for authentication. The proxy uses the client-credentials flow, so given a `client_id` and `client_secret`, it will make the API call and return the response, the body and headers, to the client.

As written, the proxy accepts requests from localhost only, but you can easily change this by modifying these lines in `bcls-proxy.js`:

    // this version of this proxy accepts requests only from domains that include "localhost"
    // modify the following line to take requests from other domains
    // or remove the if block to accept requests from any domain (not recommended!)
    if (req.headers.origin.indexOf("localhost") < 0) {
        res.writeHead(500);
        res.end("Your request cannot be processed; this proxy only handles requests originating from a local web server. If you would like to build your own version of this proxy, see http://docs.brightcove.com/en/perform/oauth-api/guides/quick-start.html");
    }


## Installation

This is a node.js app, so you will need to install [node.js](//nodejs.org). This is not a public module, so you will need to put `bcls-proxy.js` where you want it to live on your server manually. You can also copy the `node_modules` folder there - it contains the dependencies for the app. Alternatively, copy the `package.json` file to the same folder as `bcls-proxy.js`, navigate to that folder from a command line, and run:

    $ [sudo] npm install

This will install the dependencies.

As written, the proxy listens for requests on port `8003`, but you can change this to another port by modifying this line in `bcls-proxy.js`:

    }).listen(8003);

## Starting the proxy

To start the proxy, just run this at a commond line in the folder where `bcls-proxy.js` is located:

    $ node bcls-proxy.js

If you want to keep the proxy running on a remote server, there are several modules that will keep the proxy running in the background, such as nodejitsu's [forever](https://github.com/nodejitsu/forever).

## Usage

The proxy expects a `POST` request with the following `application/x-www-form-urlencoded` fields:

    client_id     // a valid client id the API request (required)
    client_secret // a valid client secret for the API request (required)
    url           // the full URL for the API request (required)
    requestType   // for the API request: GET | POST | PUT | PATCH | DELETE (optional - default: GET)
    requestBody   // generally JSON to be sent with write calls (optional)

See `tester.html` for a sample implementation, and you can view the live sample at [http://solutions.brightcove.com/bcls/bcls-proxy/tester.html](http://solutions.brightcove.com/bcls/bcls-proxy/tester.html). Note that `tester.html` points to proxy on solutions.brightcove.com (in the form `action`) - you will need to modify that if you want to use the page to test your own implementation.
