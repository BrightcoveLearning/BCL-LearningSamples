(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./index');

},{"./index":2}],2:[function(require,module,exports){
(function (global){
var videojs = (typeof window !== "undefined" ? window.videojs : typeof global !== "undefined" ? global.videojs : null),
    getData = require('./src/get-data.js'),
    getSources = require('./src/get-sources.js'),
    isArray = Array.isArray || function(array) {
      return Object.prototype.toString.call(array) === '[object Array]';
    },
    isInSources = function(arr, src) {
      var i = 0;
      for (; i < arr.length; i++) {
        if (arr[i] === src || arr.src === src) {
          return true;
        }
      }

      return false;
    },
    catalog;

/*
 * The bc-catalog video.js plugin.
 * It will either receive accountId, and policyKey in the options object
 * or read them from the video element attributes.
 */
catalog = function(options) {
  var player = this,
      loadVideo,
      loadPlaylist,
      createVideo,
      playerOptions,
      playerOpts,
      settings;

  playerOptions = player.options();
  playerOpts = {
    'accountId': playerOptions['data-account'],
    'policyKey': playerOptions['data-policy-key']
  };

  settings = videojs.util.mergeOptions(playerOpts, options);

  // check whether mediainfo needs to be re-populated from the
  // currently loaded playlist whenever a new video is loaded
  player.on('loadstart', function() {
    var mediainfo;
    if (!player.playlist) {
      // the playlist plugin isn't loaded so the mediainfo can't be
      // coming from a playlist
      return;
    }

    // lookup the mediainfo for the current src
    mediainfo = player.playlist()[player.playlist.indexOf(player.currentSrc())];
    if (mediainfo) {
      player.mediainfo = mediainfo;
    }
  });

  /**
   * Load a video object into the player. This method will update
   * the player's mediainfo, poster, and source properties. Most of
   * the time you will call this method with the result of a call to
   * getVideo():
   *
   * player.catalog.getVideo(7, function(error, video) {
   *   if (error) {
   *     alert('Something unexpected happened loading video 7!');
   *     return;
   *   }
   *   player.catalog.load(video);
   * });
   * @param video {object} the video object to load.
   */
  loadVideo = function(video) {
    var Cue, i, track, cue, vttCue, tracks, oldMediaInfo;

    Cue = window.VTTCue || window.TextTrackCue;

    oldMediaInfo = player.mediainfo;

    player.mediainfo = video;
    player.el().setAttribute('data-video-id', video.id);
    player.poster(video.poster);
    player.src(video.sources);

    tracks = player.textTracks();
    if (tracks) {
      // disable all the current text_tracks like cue_points
      for (i = 0; i < tracks.length; i++) {
        tracks[i].mode = 'disabled';
      }

      tracks = player.remoteTextTracks();
      if (tracks) {
        // remove all remote text tracks of the previous video
        i = tracks.length;
        while (i--) {
          player.removeRemoteTextTrack(tracks[i]);
        }
      }
    }

    if (video.cue_points) {
      track = player.addTextTrack('metadata');

      for (i = 0; i < video.cue_points.length; i++) {
        cue = video.cue_points[i];
        vttCue = new Cue(cue.time, cue.time, cue.type);
        track.addCue(vttCue);
      }
    }

    if (video.textTracks) {
      for (i = 0; i < video.textTracks.length; i++) {
        player.addRemoteTextTrack(video.textTracks[i]);
      }
    }
  };

  /**
   * Load a playlist object into the player.
   */
  loadPlaylist = function(playlist) {
    player.mediainfo = playlist[0];

    player.playlist(playlist);
  };

  /**
   * Filters and transforms a raw video object from the playback API to
   * adapt it for use in this browser. It re-arranges the sources, for
   * instance, to ensure that the sources that are expected to provide
   * the highest quality viewing experience on this platform are
   * attempted first.
   * @param data {object} - a video object parsed from a playback API
   * response
   * @return {object} - a new video object that is more consistent with
   * the browser environment
   */
  createVideo = function(data) {
    var video = videojs.util.mergeOptions(data);

    // expose the original sources for debugging
    video.rawSources_ = video.sources;

    // apply source transformations and post-processing
    sources = (options.getSources || getSources)(video);
    video.sources = sources;
    if (video.text_tracks) {
      video.textTracks = video.text_tracks;
      delete video.text_tracks;
    }
    // scale duration from milliseconds to seconds, to match video.duration
    if (video.duration) {
      video.duration = video.duration * 0.001;
    }

    // warn when deprecated properties are accessed
    (function() {
      try {
        Object.defineProperty(video, 'data', {
          get: function() {
            videojs.log('video.data is deprecated. Use video directly instead');
            return video;
          }
        });
        Object.defineProperty(video, 'text_tracks', {
          get: function() {
            videojs.log('video.text_tracks is deprecated. Use video.textTracks instead');
            return video.textTracks;
          }
        });
      } catch (e) {
        // skip the warning in IE8
      }
    })();

    return video;
  };


  player.catalog = {

    /**
     * Makes a catalog request for the video with the specified id and
     * invokes a callback when the request completes.
     * @param videoId {string} a numeric video id or a reference id
     * prefixed by "ref:"
     * @param callback {function} a function that will be called when
     * the request completes, whether it's successful or not. It is
     * invoked with two arguments. If the first is truthy, an error
     * occurred when making the request and this object contains
     * details of the error. Otherwise the second argument to the
     * callback is the requested video object.
     * @return {XMLHttpRequest} the underlying request object used to
     * make the catalog call.
     */
    getVideo: function(videoId, callback) {
      var opts = videojs.util.mergeOptions({}, settings);
      opts.videoId = videoId;
      opts.player = player;

      // forward the TVE token if one is defined
      if (player.catalog.tveToken) {
        opts.tveToken = player.catalog.tveToken;
      }

      // increment the number of outstanding requests
      player.catalog.loading++;

      return getData(opts, function(err, data) {
        var sources, video;

        // decrement the number of outstanding request because this
        // one has finished
        player.catalog.loading--;

        if (err) {
          err.data = data;
          catalog.error = err;
          return callback(err, data);
        }

        // the request was aborted
        if (!data) {
          return callback(null, null);
        }

        video = createVideo(data);

        // expose the most recent response for debugging
        catalog.data = data;
        catalog.sources = video.sources;
        catalog.poster = video.poster;


        callback(null, video);
      });
    },

    getPlaylist: function(playlistId, callback) {
      var opts = videojs.util.mergeOptions({}, settings);
      opts.playlistId = playlistId;
      opts.player = player;


      // forward the TVE token if one is defined
      if (player.catalog.tveToken) {
        opts.tveToken = player.catalog.tveToken;
      }

      // increment the number of outstanding requests
      player.catalog.loading++;

      return getData(opts, function(err, data) {
        var i, result = [];

        // decrement the number of outstanding request because this
        // one has finished
        player.catalog.loading--;

        if (err) {
          err.data = data;
          catalog.error = err;
          return callback(err, data);
        }

        // the request was aborted
        if (!data) {
          return callback(null, null);
        }

        // expose the full playlist response for advanced users
        player.catalog.data = data;

        for (i = 0; i < data.videos.length; i++) {
          result.push(createVideo(data.videos[i]));
        }

        callback(null, result);
      });
    },

    load: function(data) {
      if (isArray(data)) {
        return loadPlaylist(data);
      }

      loadVideo(data);
    },

    /**
     * The number of outstanding catalog requests.
     */
    loading: 0
  };

  // bcCatalog is deprecated but still usable for now
  player.bcCatalog = player.catalog;
  try {
    Object.defineProperty(player, 'bcCatalog', {
      get: function() {
        videojs.log('The property `bcCatalog` is deprecated. Use `catalog` instead.');
        return player.catalog;
      }
    });
  } catch(e) {
    // IE8 exposes defineProperty but throws when it is invoked
    // just don't bother with the friendly warning in that browser
  }

};

videojs.plugin('bcCatalog', function() {
  videojs.log('The property `bcCatalog` is deprecated. Use `catalog` instead.');
  catalog.apply(this, arguments);
});
videojs.plugin('catalog', catalog);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/get-data.js":3,"./src/get-sources.js":4}],3:[function(require,module,exports){
var makeRequest = require('./make-request.js'),
    extend;

extend = function extend(obj) {
  var newObjs = Array.prototype.slice.call(arguments, 1),
      i = 0,
      newObj,
      key;

  for (; i < newObjs.length; i++) {
    newObj = newObjs[i];
    for (key in newObj) {
      if (newObj[key] !== undefined) {
        obj[key] = newObj[key];
      }
    }
  }
  return obj;
};

/*
 * This function accepts an options object which contain:
 *   * accountId (required)
 *   * videoId (required)
 *   * policyKey (required)
 *   * baseUrl
 * It will throw an error if any of the requried fields are missing.
 * It will then make a request to the provided baseUrl or the default one to
 * get data and then return it to the provided callback
 *
 * @param options {Object} an object with the accountId, videoId, and policyKey
 * @param cb {function} the callback function that will get returned with either an error or data
 * @return {object} the request object. When running in a browser,
 * this is an XMLHttpRequest.
 */
module.exports = function getData(options, cb) {
  var settings, headers;

  if (!options.accountId || !(options.videoId || options.playlistId) || !options.policyKey) {
    cb(new Error('accountId, videoId or playlistId, and policy key are required fields'));
  }

  settings = {
    baseUrl: 'https://edge.api.brightcove.com/playback/v1/'
  };

  settings = extend(settings, options || {});

  return makeRequest(settings, function(err, data) {
    var sources;

    if (err) {
      return cb(err, data);
    }

    cb(null, data);
  });
};

},{"./make-request.js":5}],4:[function(require,module,exports){
/*
 * This function received the raw data from the edge server and returns a list of
 * sources.
 * The returned list of sources is reordered to have HLS first, MP4 second,
 * and everything else last.
 * It will also add the appropriate mimetype `type` property to each source object.
 *
 * @param data {Object} the raw data returned from the edge api server
 * @return sources {Array} an Array of ordered sources with src and type attributes
 */
var getSources = function(data) {
  var sources = data.sources || [], results = [], source, i;

  // build up a list of candidate sources and add MIME types
  for (i = 0; i < sources.length; i++) {
    source = sources[i];

    if (source.src && source.container === 'MP4') {
      source.type = 'video/mp4';
      results.push(source);
    } else if (source.src && source.container === 'M2TS') {
      source.type = 'application/vnd.apple.mpegurl';

      // include http+HLS if https is not preferred or native HLS is
      // available
      if ((/^https:\/\//).test(source.src) || // https+HLS is always ok
          !getSources.preferHttps ||          // the page is http
          getSources.supportsNativeHls) {    // native HLS is available
        results.push(source);
      }
    } else {
      results.push(source);
    }
  }

  // sort
  return results.sort(sourceSort);
};

// sorting functions
var sourceSort = function(left, right) {
  var lookup = getSources.preferHttps ? sourcePriorities.https : sourcePriorities.http,
      leftPriority,
      rightPriority;
  if (getSources.supportsNativeHls) {
    lookup = lookup.nativeHls;
  } else {
    lookup = lookup.noNativeHls;
  }

  return sourcePriority(lookup, left) - sourcePriority(lookup, right);
};
var sourcePriority = function(table, source) {
  // sources without a src property should always be a last resort
  if (!source.src) {
    return 9999;
  }

  // lookup the source's protocol
  table = table[(/^[^:]*/).exec(source.src)];
  // unknown protocols should be a last resort
  if (!table) {
    return 9999;
  }

  // lookup the source's MIME type
  return table[source.type] || 9999;
};

// there doesn't seem to be a consistent set of priorities that can be
// applied to our source-sorting logic so we completely enumerate the
// possibilities
// lookups are made as follows:
// containing page protocol -> native HLS support -> source protocol -> source MIME
var sourcePriorities = {
  http: {
    nativeHls: {
      http: {
        'application/vnd.apple.mpegurl': 1,
        'video/mp4': 3
      },
      https: {
        'application/vnd.apple.mpegurl': 2,
        'video/mp4': 4
      }
    },
    noNativeHls: {
      http: {
        'application/vnd.apple.mpegurl': 1,
        'video/mp4': 3
      },
      https: {
        'application/vnd.apple.mpegurl': 2,
        'video/mp4': 4
      }
    }
  },
  https: {
    nativeHls: {
      http: {
        'application/vnd.apple.mpegurl': 3,
        'video/mp4': 4
      },
      https: {
        'application/vnd.apple.mpegurl': 1,
        'video/mp4': 2
      }
    },
    noNativeHls: {
      http: {
        'application/vnd.apple.mpegurl': 4,
        'video/mp4': 3
      },
      https: {
        'application/vnd.apple.mpegurl': 1,
        'video/mp4': 2
      }
    }
  }
};

// configuration options
getSources.supportsNativeHls = (function() {
  var video = document.createElement('video');
  if (video && video.canPlayType) {
    return (/probably|maybe/i).test(video.canPlayType('application/vnd.apple.mpegurl'));
  }
  return false;
})();
getSources.preferHttps = (/^https:/).test(window.location.href);

// exports
module.exports = getSources;

},{}],5:[function(require,module,exports){
var request = require('request');

/*
 * This function takes an options object with the following:
 *    * accountId
 *    * videoId
 *    * policyKey
 *    * baseUrl
 * This function makes the actual request to edge server returning the data to the callback.
 *
 * This function shouldn't be used directly but via `get-data.js`.
 *
 * @param options {Object} options object containing accountId, videoId, baseUrl, and policyKey
 * @param cb {function}
 * @return {object} the request object
 */
module.exports = function makeRequest(options, cb) {
  var
    videoRequestUrl,
    videosOrPlaylists = 'videos',
    catalogId,
    headers;

  if (options.policyKey) {
    headers = {
      "BCOV-Policy": options.policyKey
    };
  }

  if (options.baseUrl.slice(-1) !== '/') {
    options.baseUrl += '/';
  }

  if (options.videoId) {
    videosOrPlaylists = 'videos';
    catalogId = options.videoId;
  } else if (options.playlistId) {
    videosOrPlaylists = 'playlists';
    catalogId = options.playlistId;
  }

  videoRequestUrl = options.baseUrl + 'accounts/' + options.accountId + '/' + videosOrPlaylists + '/' + catalogId;

  // add a TVE token if one was provided
  if (options.tveToken) {
    videoRequestUrl += '?tveToken=' + window.encodeURIComponent(options.tveToken);
  }

  options.player.trigger({
    type: 'catalog_request',
    url: videoRequestUrl,
    videoId: options.videoId
  });

  return request({
    url: videoRequestUrl,
    strictSSL: false,
    headers: headers
  }, function(err, response, body) {
    if (err) {
      options.player.trigger({
        type: 'catalog_request_error',
        url: videoRequestUrl,
        error: err
      });
      return cb(err, body);
    }

    try {
      body = JSON.parse(body);
    } catch (parseError) {
      options.player.trigger({
        type: 'catalog_request_error',
        url: videoRequestUrl,
        response: response,
        error: parseError
      });
      return cb(parseError, body);
    }

    if (response.status >= 400) {
      options.player.trigger({
        type: 'catalog_request_error',
        url: videoRequestUrl,
        response: response,
        error: new Error('Request Failed')
      });
      return cb(response, body);
    }
    options.player.trigger({
      type: 'catalog_response',
      url: videoRequestUrl,
      response: response
    });
    cb(null, body);
  });
};

},{"request":6}],6:[function(require,module,exports){
/*
 * This is a small polyfill on top of XMLHttpRequest that exposes a `request`
 * module-like interface.
 */


var iframe,
    iframeRequest,
    xhrRequest;

// Modern browsers, XHR+CORS implementation

xhrRequest = function(options, cb) {
  var url = options.url,
      headers = options.headers,
      header,
      xhr;

  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  if (headers) {
    for (header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
  }

  xhr.onreadystatechange = function() {

    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.timeout) {
      return cb(new Error('timeout'), xhr);
    }

    if (xhr.readyState === 4) {
      return cb(null, xhr, xhr.responseText);
    }
  };

  xhr.url = url;
  xhr.send();
  return xhr;
};


// detect CORS and kick off the iframe fallback if necessary
if (XMLHttpRequest && !('withCredentials' in new XMLHttpRequest())) {

  // IE8 and 9, proxy-iframe implementation
  var iframeLoadHandler,
      iframeLoadingRequest,
      iframeReadyRequest,
      currentIframeRequest,
      dispatchResponse,
      nextRequestId = 0,
      iframeRequests = {},
      pendingRequests = [];

  iframe = document.createElement('iframe');
  iframe.src = 'https://edge.api.brightcove.com/player-ie-proxy.html';
  document.getElementsByTagName('head')[0].appendChild(iframe);

  // queue all requests until the iframe is available
  iframeLoadHandler = function() {
    // send all the pending requests
    var i = pendingRequests.length;
    while (i--) {
      iframeReadyRequest.apply(this, pendingRequests[i]);
    }
    pendingRequests.length = 0;

    // future requests should be sent immediately
    currentIframeRequest = iframeReadyRequest;
  };
  if (iframe.attachEvent) {
    iframe.attachEvent('onload', iframeLoadHandler);
  } else {
    iframe.addEventListener('load', iframeLoadHandler);
  }

  iframeLoadingRequest = function(options, cb) {
    pendingRequests.push([options, cb]);
    return iframe;
  };
  iframeReadyRequest = function(options, cb) {
    options.id = nextRequestId++;
    iframeRequests[options.id] = cb;
    iframe.contentWindow.postMessage(JSON.stringify(options), '*'); // 'https://edge.api.brightcove.com');
    return iframe;
  };
  currentIframeRequest = iframeLoadingRequest;

  iframeRequest = function() {
    currentIframeRequest.apply(this, arguments);
  };

  dispatchResponse = function(event) {
    var response, callback, i, header, headers, splitIndex;

    // ignore messages from sources other than the iframe
    if (event.source !== iframe.contentWindow) {
      return;
    }

    try {
      response = JSON.parse(event.data);
    } catch (error) {
      return videojs.log('Error parsing edge.api iframe response', error);
    }

    // find and remove the stored callback
    callback = iframeRequests[response.id];
    delete iframeRequests[response.id];

    if (!callback) {
      return videojs.log('Received unexpected message from the edge.api iframe');
    }

    // parse headers into a format that allow easy lookups
    response.headers = response.headers.replace('\r', '').split('\n');
    headers = {};
    for (i = 0; i < response.headers; i++) {
      // parse the header line into the name and value
      splitIndex = response.headers[i].indexOf(':');
      header = [
        response.headers[i].substring(0, splitIndex),
        response.headers[i].substring(splitIndex + 1)];
      // trim whitespace
      header[0] = header[0].replace(/^\s+|\s+$/g, '');
      header[1] = header[1].replace(/^\s+|\s+$/g, '');

      headers[header[0]] = header[1];
    }
    response.headers = headers;

    // emulate XMLHttpResponse.getResponseHeader
    response.getResponseHeader = function(name) {
      return this.headers[name];
    };
    callback(null, response, response.response);
  };

  // listen for incoming messages and dispatch callbacks
  if (window.addEventListener) {
    window.addEventListener('message', dispatchResponse);
  } else {
    window.attachEvent('onmessage', dispatchResponse);
  }

  module.exports = iframeRequest;
} else {
  module.exports = xhrRequest;
}

},{}]},{},[1]);
