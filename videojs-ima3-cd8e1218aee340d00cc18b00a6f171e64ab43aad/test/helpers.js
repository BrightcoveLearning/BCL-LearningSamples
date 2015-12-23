window.helpers = (function(window) {
  return {

    /**
     * Determines whether or not an element has a given HTML class.
     *
     * @param  {HTMLElement}  el
     * @param  {String}       className
     * @return {Boolean}
     */
    hasClass: function(el, className) {
      if (el.classList) {
        return el.classList.contains(className);
      } else {
        return el.className.indexOf(className) > -1;
      }
    },

    /**
     * Creates a function for getting the computed style for an element and
     * optional pseudo-element. The returned function will get the computed
     * style for that element for any property.
     *
     * @param  {HTMLElement} el
     * @param  {String} pseudo
     * @return {Function}
     */
    getComputedStyle: function(el, pseudo) {
      return function(prop) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, pseudo)[prop];
        } else {
          return el.currentStyle[prop];
        }
      };
    }
  };
}(window));
