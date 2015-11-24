var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = [];
  },

  register: function(name, element){
    __mapped[name] = element;
  },

  unregister: function(name) {
    delete __mapped[name];
  },

  get: function(name) {
    return __mapped[name];
  },

  setActiveLink: function(link) {
    __activeLink = link;
  },

  getActiveLink: function() {
    return __activeLink;
  },

  isVisible: function(target) {
      var vpHeight  = window.innerHeight;
	  var rec = target.getBoundingClientRect();
	  var tViz = rec.top >= 0 && rec.top <  vpHeight;
	  var bViz = rec.bottom > 0 && rec.bottom <= vpHeight;
	  // If we want to allow the option of making sure the top and bottom of the element
	  // are visible this is how.
	  // var vVisible = partial ? tViz || bViz : tViz && bViz;
	  var vVisible = tViz || bViz;

	  return vVisible;
  },

  scrollTo: function(to, animate, duration, offset, ifNotVisible) {

     /*
     * get the mapped DOM element
     */

      var target = __mapped[to];

      if(!target) {
        throw new Error("target Element not found");
      }

      var coordinates = target.getBoundingClientRect();

      // Bail out if you can see it.
      if (ifNotVisible && this.isVisible(target)) {
        return;
      }

      /*
       * if animate is not provided just scroll into the view
       */

      if(!animate) {
        var bodyRect = document.body.getBoundingClientRect();
        var scrollOffset = coordinates.top - bodyRect.top;
        window.scrollTo(0, scrollOffset + (offset || 0));
        return;
      }

      /*
       * Animate scrolling
       */

      var options = {
        duration : duration
      };

      animateScroll.animateTopScroll(coordinates.top + (offset || 0), options);

  }
};

