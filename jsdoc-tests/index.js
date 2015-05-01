var videojs = require('video.js'),
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

/** @namespace */
  player.catalog = {

    /** @function 
     * Makes a catalog request for the video with the specified id and
     * invokes a callback when the request completes.
     * @name getVideo
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

    /** @function 
     * Makes a catalog request for the video with the specified id and
     * invokes a callback when the request completes.
     * @name getPlaylist
     * @param palylistId {string} a numeric playlist id or a reference id
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
    /** @function 
     * Loads a video or playlist object into the player. This method 
     * will update the player's mediainfo property, and update the 
     * video source and poster. In most cases, you would call this 
     * method with the result of a call to getVideo() or getPlaylist(). 
     * If you'd like to be notified when mediainfo has been updated, 
     * listen for the loadstart event.
     * @name load
     * @param mediaobject {object} A video or playlist object to load. This object should have the same format as the response object from a call to getVideo() or getPlaylist()method.
     */
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
