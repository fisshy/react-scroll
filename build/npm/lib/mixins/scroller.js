var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = [];
  },

  register: function(name, element, parent, relativePosition){
    __mapped[name] = element;
    //save the parent to the object and the relativeposition of the element inside of the parent div
    __mapped[name + "parent"] = parent;
    __mapped[name + "position"] = relativePosition;
  },

  unregister: function(name) {
    delete __mapped[name];
    delete __mapped[name + "parent"];
    delete __mapped[name + "position"];
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


      //check to make sure that the scrollable parent div exists
      if (__mapped[to+"parent"]){
        var relativePosition = __mapped[to + "position"];
        var parent = __mapped[to + "parent"];
        //set the target equal to the Dom of the parent div
        var target = parent;
      }
      else {
        var target = __mapped[to];
      }

      if(!target) {
        throw new Error("target Element not found");
      }

      var cordinates = target.getBoundingClientRect();
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
        window.scrollTo(0, cordinates.top + (offset || 0));
        return;
        
      }

      /*
       * Animate scrolling
       */

      var options = {
        duration : duration
      };
      //added parentQ parameter and relativePosition
      animateScroll.animateTopScroll(cordinates.top + (offset || 0), options, parent, relativePosition);

  }
};

