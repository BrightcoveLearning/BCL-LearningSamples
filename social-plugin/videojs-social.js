/*! videojs-social - v0.0.0 - 2014-5-1
 * Copyright (c) 2014 Brightcove
 * Licensed under the Apache-2.0 license. */
;(function(window, videojs) {
  'use strict';

  // Allocate all variables to be used
  var defaults = {
        'title': '',
        'description': '',
        'url': '',
        'deeplinking': false,
        'offset': '00:00:00',
        'services': {
           'facebook': true,
           'google': true,
           'twitter': true,
           'tumblr': true,
           'pinterest': true,
           'linkedin': true
        }
      },
      on = function(el, type, callback) {
        if (el.addEventListener) {
          return el.addEventListener(type, callback, false);
        }
        return el.attachEvent(type, callback, false);
      },
      player,
      updateTitle,
      updateOffset,
      convertOffset,
      updateDirectLink,
      computeDirectLink,
      computeEmbedCode,
      socialButtonEventHandler,
      bindSocialButton,
      addSocialButtons,
      addServiceButton,
      SocialButton,
      SocialOverlay,
      social;


  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  social = function(options) {

    var settings;

    // Assign this
    player = this;

    // Merge options with the buttons defaults
    settings = videojs.util.mergeOptions(defaults, options);
    
    // Add social button to player
    player.controlBar.socialButton = player.controlBar.addChild('SocialButton', settings);

    // Add tabindex
    player.controlBar.socialButton.el().setAttribute('tabindex', '0');
  };


  /*
   * The "Share" control bar button
   */
  SocialButton = videojs.SocialButton = videojs.Button.extend({
    init: function(player, options) {
      videojs.Button.call(this, player, {
        el: videojs.Button.prototype.createEl.call(this, 'div', {
          className: 'vjs-share-control vjs-control',
          role: 'button',
          'aria-live': 'polite',
          innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">Share</span></div>'
        })
      });

      // Bind touchstart for mobile browsers and prevent default
      this.on('touchstart', function(e) {
        if (!player.socialOverlay) {
          player.socialOverlay = player.addChild('SocialOverlay', options);
        }
        player.socialOverlay.show();
        e.preventDefault();
      });

      // Bind click event for desktop browsers
      this.on('click', function() {
        if (!player.socialOverlay) {
          player.socialOverlay = player.addChild('SocialOverlay', options);
        }
        player.socialOverlay.show();
      });

    }
  });


  /*
   * addServiceButton - Creates a link that appears as a social sharing button.
   */
  addServiceButton = function(service) {
      var link = '';

      // Switch on the requested service
      switch(service)
      {
        // Facebook
        case 'facebook':
          link = '<li><a class="vjs-share-facebook" title="Facebook" target="_blank"><span class="vjs-control-text">Facebook</span></a></li>';
          break;

        // Google+
        case 'google':
          link = '<li><a class="vjs-share-gplus" title="Google+" target="_blank"><span class="vjs-control-text">Google+</span></a></li>';
          break;

        // Twitter
        case 'twitter':
          link = '<li><a class="vjs-share-twitter" title="Twtter" target="_blank"><span class="vjs-control-text">Twitter</span></a></li>';
          break;

        // Tumblr
        case 'tumblr':
          link = '<li><a class="vjs-share-tumblr" title="Tumblr" target="_blank"><span class="vjs-control-text">tumblr</span></a></li>';
          break;

        // Pinterest
        case 'pinterest':
          link = '<li><a class="vjs-share-pinterest" title="Pinterest" target="_blank"><span class="vjs-control-text">Pinterest</span></a></li>';
          break;

        // LinkedIn
        case 'linkedin':
          link = '<li><a class="vjs-share-linkedin" title="LinkedIn" target="_blank"><span class="vjs-control-text">LinkedIn</span></a></li>';
          break;

        default:
          throw new Error('An unsupported social service was specified.');
      }

      // Return the constructed link
      return link;
  };


  /*
   * Iterates through the list of selected social services and creates their html
   */
  addSocialButtons = function(services) {

    var servicesHtml, service;

    // Iterate through supported services and construct html
    servicesHtml = '';
    for(service in services) {
      servicesHtml += addServiceButton(service);
    }

    // return html
    return servicesHtml;
  };


  /*
   * Updates the title based on the media date or the custom options setting
   */
  updateTitle = function(options) {
    var playerOptions;

      // If there's no title try and find one in the options
      if (!options.title) {

        // Get player options
        playerOptions = player.options();

        // Search the player options data media for a title
        if (playerOptions['data-media'] && playerOptions['data-media'].title) {
          options.title = playerOptions['data-media'].title;
        } else {
          options.title = '';
        }
      }
  };


  /*
   * Converts an offset from hh:mm:ss to the YouTube format of 1h27m14s
   */
  convertOffset = function(offset) {

    var segments,
        seconds = 0,
        multiples = [1, 60, 3600],
        ret = '',
        i,
        s;

    if (offset) {
      segments = offset.split(':');
      if (segments.length >= 1 && segments.length <= 3) {
        // Parse each segment into an integer to remove leading zeros and other dentritis
        for(i = 0; i < segments.length; ++i) {
          s = parseInt(segments[i], 10) * multiples[segments.length - 1 - i];
          if (isNaN(s)) {
            return '';
          }
          seconds += s;
        }
        ret = '';
        if (seconds >= 3600 && Math.floor(seconds / 3600) !== 0) {
          ret = Math.floor(seconds / 3600) + 'h';
          seconds = seconds % 3600;
        }
        
        if (seconds >= 60 && Math.floor(seconds / 60) !== 0) {
          ret += Math.floor(seconds / 60) + 'm';
          seconds = seconds % 60;
        }
        
        if (seconds > 0) {
          ret += seconds + 's';
        }

        return ret;

      }
    }

    return '';
  };


  /*
   * Converts an offset specified in hh:mm:ss to the YouTube format of 1h30m7s
   */
  updateOffset = function(options) {

    var segments,
        output,
        units,
        i;

    options.offsetTransformed = '';
    // Iff, options is set we will transform it to the YouTube style
    if (options.offset) {
      // Split offset into segments
      segments = options.offset.split(':');
      // Ensure we have a valid offset
      if (segments.length === 3) {
        output = '';
        units = ['h', 'm', 's'];
        for(i = 0; i < segments.length; ++i) {
          if (segments[i] !== 0) {
            output += segments[i] + units[i];
          }
        }
        options.offsetTransformed = output;
      } else {
        options.offset = '';
        options.offsetTransformed = '';
      }
    }
  };


  /*
   * Determines the URL to be dispayed in the share dialog
   */
  updateDirectLink = function(options) {

    var url;

    // Determine the custom base url
    if (options.url) {
      url = options.url;
    } else if (window.parent !== window) {
      url = document.referrer;
    }  else {
      url = window.location.href;
    }

    options.urlTransformed = options.url = url;

    // Append offset if provided
    if (options.deeplinking && options.offsetTransformed) {
      options.urlTransformed = url + '#t=' + options.offsetTransformed;
    }
  };


  /*
   * Computes the direct link given the options and the start offset textbox
   */
  computeDirectLink = function(options) {

    // Determine the custom base url
    var url, offset;
    if (options.url) {
      url = options.url;
    } else if (window.parent !== window) {
      url = document.referrer;
    } else {
        url = window.location.href;
    }

    // Get the start offset textbox (Only include offset if deeplinking is enabled)
    offset = options.deeplinking ? convertOffset(player.el().querySelector('.start-offset-textbox').value) : '';

    // Append the offset if available
    if (offset) {
        url = url + '#t=' + offset;
    }

    return url;
  };


  /*
   * Computes the new embed code 
   */
  computeEmbedCode = function(options) {
    // Declare variables
    var offset, offsetTextBox, playerOptions;
    // Assign converted initial options offset value
    offset = options.deeplinking ? convertOffset(options.offset) : null;
    // If we can't find the offset control we should use the options value
    offsetTextBox = player.el().querySelector('.start-offset-textbox');
    if (offsetTextBox && options.deeplinking) {
        offset = convertOffset(offsetTextBox.value);
    }

    // Get the player options so we can retrieve the account_id, player_id, and embed_id
    playerOptions = player.options();

    // Construct the embed code snippet
    return  '<iframe src=\'//players.brightcove.net/{{account_id}}/{{player_id}}_{{embed_id}}/index.html{{offset}}\'></iframe>'
        .replace('{{account_id}}', playerOptions['data-account'] )
        .replace('{{player_id}}', playerOptions['data-player'] )
        .replace('{{embed_id}}', playerOptions['data-embed'] )
        .replace('{{offset}}', offset ? '#t=' + offset : '');
  };


  /*
   * Social button action handler
   */
   socialButtonEventHandler = function(e, url) {
        // Launch the window
        window.open(
          url,
         '_blank',
         'width=600, height=400, top=100, left=100, titlebar=yes, modal=yes, resizable=yes, toolbar=no, status=1, location=no, menubar=no, centerscreen=yes'
        );
        // Prevent the default
        if (e.type == 'touchstart')
          e.preventDefault();
   }

  /*
   * Unobtrusively attaches events to a button
   */
  bindSocialButton = function(overlay, elementSelector, url) {

    var elt;

    // Find the element, if not available, that means if was not selected for sharing
    elt = overlay.el().querySelector(elementSelector);

    // If element found then bind events, if not found, it isn't a supported service
    if (elt) {

      // Bind touchstart for mobile browsers and prevent default
      elt.addEventListener('touchstart', function(e) { socialButtonEventHandler(e, url); } );

      // Bind click event for desktop browsers
      elt.addEventListener('click', function(e) {socialButtonEventHandler(e, url); } );
    }
  };

  /*
   * The overlay panel that is toggled when the SocialButton is clicked
   */
  SocialOverlay = videojs.SocialOverlay = videojs.Component.extend({
    init: function(player, options) {

      var embedCode,
          start,
          directLinkTextBox,
          embedCodeTextBox,
          offsetTextBox,
          encodedUrl,
          encodedTitle,
          encodedDescription,
          encodedVideoSource,
          encodedPoster,
          servicesHtml,
          service;

      // Update Video Title
      updateTitle(options);

      // Update offset
      updateOffset(options);

      // Update Share Url
      updateDirectLink(options);

      // Constructs the embedding url
      embedCode = computeEmbedCode(options);

      videojs.Component.call(this, player, {
        el: videojs.Component.prototype.createEl.call(this, 'div', {
          className: 'vjs-social-overlay',
          innerHTML:
            '<i class="vjs-social-cancel">' +
            '<div class="vjs-control-text">Close</div></i>' +
            '<form><legend>Share Video: ' + options.title + '</legend>' +
            '<label>Share via:' +
            '<ul class="vjs-share-options">' +
            addSocialButtons(options.services) +
            '</ul></label>' +
            '<div class="vjs-social-link-options">' +
              '<label class="vjs-social-start">Start From: <input class="start-offset-textbox" type="text" title="The offset must be specified using the following pattern: hh:mm:ss" placeholder="hh:mm:ss" maxlength="10" value="' + options.offset + '" /></label>' +
              '<label class="vjs-social-link">Direct Link: <input class="direct-link-textbox" type="text" readonly="true" value="' + options.urlTransformed + '"/></label>' +
            '</div>' +
            '<label>Embed Code: <input class="embed-code-textbox" type="text" readonly="true" value="' + embedCode + '"/>' +
            '</label>' +
            '</form>'
        })
      });

      // Encode share url properties
      encodedUrl = encodeURIComponent(options.url);
      encodedTitle = encodeURIComponent(options.title);
      encodedDescription = encodeURIComponent(options.description);
      encodedVideoSource = encodeURIComponent(player.options().sources[0].src);
      encodedPoster = encodeURIComponent(player.options().poster);

      // Bind Facebook button
      bindSocialButton(
        this,
        '.vjs-share-facebook',
          'https://www.facebook.com/sharer/sharer.php?u={URL}&title={TITLE}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle)
      );

      // Bind Google+ button
      bindSocialButton(
        this,
        '.vjs-share-gplus',
        'https://plus.google.com/share?url={URL}'.replace('{URL}', encodedUrl)
      );

      // Bind Twitter button
      bindSocialButton(
        this,
        '.vjs-share-twitter',
        'https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&text={TITLE}&tw_p=tweetbutton&url={URL}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle)
      );

      // Bind Tumblr button
      bindSocialButton(
        this,
        '.vjs-share-tumblr',
        'http://www.tumblr.com/share?v=3&u={URL}&t={TITLE}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle)
      );

      // Bind Pinterest button
      bindSocialButton(
        this,
        '.vjs-share-pinterest',
        'https://pinterest.com/pin/create/button/?url={URL}&media={POSTER}&description={TITLE}&is_video=true'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle).replace('{POSTER}', encodedPoster)
      );

      // Bind LinkedIn button
      bindSocialButton(
        this,
        '.vjs-share-linkedin',
        'https://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&summary={DESCRIPTION}&source=Classic'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle).replace('{DESCRIPTION}', encodedDescription)
      );

      // Hide offset if deeplinking is disabled
      if (!options.deeplinking === true) {
        start = this.el().querySelector('.vjs-social-start');
        start.className += ' vjs-hidden ';
      }

      // Add event to select the direct link when clicked
      directLinkTextBox = this.el().querySelector('.direct-link-textbox');
      directLinkTextBox.addEventListener('click', function() {
        this.select();
      });

      // Add event to select the embed code when clicked
      embedCodeTextBox = this.el().querySelector('.embed-code-textbox');
      embedCodeTextBox.addEventListener('click', function() {
        this.select();
      });

      this.offsetTextBox = this.el().querySelector('.start-offset-textbox');

      // Bind changed event to the start offset
      //  which will update the direct and embed links on changes and show it's current state
      on(this.offsetTextBox, 'keyup', function() {

        var matches,
            isValid;

        matches = this.value.match('^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}');
        isValid = matches && matches.length > 0;

        // Set the text color
        this.style.color = isValid ? '#000000' : '#FF0000';

        // Only update textboxes if this is a valid offset
        if (isValid) {
          // Compute the new direct link
          directLinkTextBox.value = computeDirectLink(options);
          // Compute the new embed code
          embedCodeTextBox.setAttribute('value', computeEmbedCode(options));
        }

      });

      // Bind the click event of the close button to hide the social overlay
      this.closeButton = this.el().querySelector('i');
      on(this.closeButton, 'click', function() {
        player.socialOverlay.hide();
      });

    },

    hide: function() {
      videojs.Component.prototype.hide.call(this);
      if (this.previouslyPlaying) {
        this.player().play();
      }
    },

    show: function() {
      videojs.Component.prototype.show.call(this);
      if (!this.player().paused()) {
        this.previouslyPlaying = true;
        this.player().pause();
      }
    }

  });

  // register the plugin
  videojs.plugin('social', social);

  // End the closure
})(window, window.videojs);