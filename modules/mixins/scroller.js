var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = [];
  },

  register: function(name, element, parents){
    __mapped[name] = {
      element: element,
      parents: parents
    };

  },

  unregister: function(name) {
    delete __mapped[name];
  },

  get: function(name) {
    return __mapped[name].element;
  },

  setActiveLink: function(link) {
    __activeLink = link;
  },

  getActiveLink: function() {
    return __activeLink;
  },

  scrollTo: function(to, animate, duration, offset, nested) {

     /*
     * get the mapped DOM element
     */
      var parents = (nested) ? __mapped[to].parents : [];
      var target = __mapped[to].element;

      if(!target) {
        throw new Error("target Element not found");
      }

      var coordinates = target.getBoundingClientRect();

      /*
       * if animate is not provided just scroll into the view
       */

      if(!animate) {
        var bodyRect = document.body.getBoundingClientRect();
        if (parents.length > 0 && nested) {
          // window scroll to outer most scrollable parent 
          var outerParent = parents[parents.length-1].getBoundingClientRect();
          var scrollOffset = outerParent.top - bodyRect.top;
          window.scrollTo(0, scrollOffset + (offset || 0));
          var previous;
          // scrolltop subsequent nested parents
          for (var i = parents.length-2; i >= 0; i--) {
            previous = parents[i+1];
            previous.scrollTop = parents[i].offsetTop;
          }
          // direct parent scrolltop to target position
          parents[0].scrollTop = target.offsetTop;
          return;
        } else {
          //if parent div doesn't exist run normally
          var scrollOffset = coordinates.top - bodyRect.top;
          window.scrollTo(0, scrollOffset + (offset || 0));
          return;
        }
      }

      /*
       * Animate scrolling
       */

      var options = {
        duration : duration
      };
      // pass in parents to animate topscroll
      animateScroll.animateTopScroll(coordinates.top + (offset || 0), options, parents, target.offsetTop);

  }
};

