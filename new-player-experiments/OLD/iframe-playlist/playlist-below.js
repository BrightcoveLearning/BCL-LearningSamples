videojs.plugin('playlistBelow', function() {
  var player = this,
  HTMLElement.prototype.wrap = function(elms) {
      // Convert `elms` to an array, if necessary.
      if (!elms.length) elms = [elms];

      // Loops backwards to prevent having to clone the wrapper on the
      // first element (see `child` below).
      for (var i = elms.length - 1; i >= 0; i--) {
          var child = (i > 0) ? this.cloneNode(true) : this;
          var el    = elms[i];

          // Cache the current parent and sibling.
          var parent  = el.parentNode;
          var sibling = el.nextSibling;

          // Wrap the element (is automatically removed from its current
          // parent).
          child.appendChild(el);

          // If the element had a sibling, insert the wrapper before
          // the sibling to maintain the HTML structure; otherwise, just
          // append it to the parent.
          if (sibling) {
              parent.insertBefore(child, sibling);
          } else {
              parent.appendChild(child);
          }
      }
  },
  var wrapIt = function() {
    var the_ol = document.getElementsByTagName("ol");
    var the_div = document.createElement('div');
    the_div.setAttribute("class", "playlist-wrapper");
    the_div.wrap( the_ol );
  }
  myPlayer.on('loadeddata', wrapIt);
});  