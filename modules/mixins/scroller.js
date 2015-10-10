var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

// This is needed to prevent scroll-snap from overriding 'to', when we need to
// leap over several elements
var __target = null;

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

  getAll: function() {
    return __mapped;
  },

  setActiveLink: function(link) {
    __activeLink = link;
  },

  getActiveLink: function() {
    return __activeLink;
  },

  setTarget: function(target) {
    __target = target;
  },

  getTarget: function() {
    return __target;
  },

  flushTarget: function() {
    __target = null;
  },

  scrollTo: function(to, animate, duration, offset) {

     /*
     * get the mapped DOM element
     */

      var target = __mapped[to];

      if(!target) {
        throw new Error("target Element not found");
      }

      this.setTarget(to);

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

