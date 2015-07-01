var animateScroll = require('./animate-scroll');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = [];
  },

  register: function(name, element){
    __mapped[name] = element;
    //added parent dom
    __mapped[name + "parent"] = parentQuery;
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

      var parentQuery;
      var relativePosition;
      if (__mapped[to+"parent"].length > 0){
        relativePosition = __mapped[to + "position"];
        parentQuery = __mapped[to + "parent"];
        var target = parentQuery.get(0);
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
        if (parentQuery){
          parentQuery.get(0).scrollTop = relativePosition;
          return;
        }
        window.scrollTo(0, cordinates.top + (offset || 0));
        return;
        
      }

      /*
       * Animate scrolling
       */

      var options = {
        duration : duration
      };
      //added parent parameter
      animateScroll.animateTopScroll(cordinates.top + (offset || 0), options, parentQuery, relativePosition);

  }
};

