var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = [];
  },

  register: function(name, element, parent, relativePosition){
    __mapped[name] = {
      element: element,
      parent: parent,
      position: relativePosition
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

  scrollTo: function(to, animate, duration, offset) {

     /*
     * get the mapped DOM element
     */


      //check to make sure that the scrollable parent div exists
      if (__mapped[to].parent){
        var relativePosition = __mapped[to].position;
        var parent = __mapped[to].parent;
        //set the target equal to the Dom of the parent div
        var target = parent;
      }
      else {
        var target = __mapped[to].element;
      }

      if(!target) {
        throw new Error("target Element not found");
      }

      var coordinates = target.getBoundingClientRect();

      /*
       * if animate is not provided just scroll into the view
       */

      if(!animate) {
        //if parent div exists just set the scrolTop of the div to the relativePosition of the element (no animation or duration)
        if (parent){
          parent.scrollTop = relativePosition;
          return;
        }
        //if parent div doesn't exist run normally
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
      //added parentQ parameter and relativePosition
      animateScroll.animateTopScroll(coordinates.top + (offset || 0), options, parent, relativePosition);

  }
};

