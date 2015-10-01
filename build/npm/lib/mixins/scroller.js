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

  scrollTo: function(to, animate, duration, offset, containerId) {

     /*
     * get the mapped DOM element
     */

      var target = __mapped[to];

      if(!target) {
        throw new Error("target Element not found");
      }

      var coordinates = target.getBoundingClientRect();
      var container = document.getElementById(containerId);
      var containerRect = container.getBoundingClientRect();
      var scrollOffset = coordinates.top - containerRect.top;

      /*
       * if animate is not provided just scroll into the view
       */

      if(!animate) {
        container.scrollTop += scrollOffset + (offset || 0);
        return;
      }

      /*
       * Animate scrolling
       */

      var options = {
        duration : duration,
        containerId: containerId
      };

      animateScroll.animateTopScroll(scrollOffset + (offset || 0), options);

  }
};

