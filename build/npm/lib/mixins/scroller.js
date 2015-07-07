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

  scrollTo: function(to, animate, duration, offset) {

     /*
     * get the mapped DOM element
     */

      var target = __mapped[to];

      if(!target) {
        throw new Error("target Element not found");
      }

      var coordinates = target.getBoundingClientRect();

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

