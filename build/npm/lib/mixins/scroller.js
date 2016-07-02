var animateScroll = require('./animate-scroll');
var events = require('./scroll-events');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = {};
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

  scrollTo: function(to, props) {
    var bodyRect;
    var scrollOffset;

    /*
    * get the mapped DOM element
    */
    var target = this.get(to);

    if(!target) {
      throw new Error("target Element not found");
    }

    props = props || {};

    var coordinates = target.getBoundingClientRect();
    var container = props.containerId ? document.getElementById(props.containerId) : undefined;
    var containerRect = container ? container.getBoundingClientRect() : undefined;

    if (container) {
      scrollOffset = coordinates.top - containerRect.top;
    } else {
      bodyRect = document.body.getBoundingClientRect();
      scrollOffset = coordinates.top - bodyRect.top;
    }

    if(events.registered['begin']) {
      events.registered['begin'](to, target);
    }

    /*
     * if animate is not provided just scroll into the view
     */
    if(!props.smooth) {

      if (container) {
        container.scrollTop += scrollOffset + (props.offset || 0);
      } else {
        window.scrollTo(0, scrollOffset + (props.offset || 0));
      }

      if(events.registered['end']) {
        events.registered['end'](to, target);
      }

      return;
    }

    /*
     * Animate scrolling
     */
    if (container) {
      animateScroll.animateTopScroll(scrollOffset + (props.offset || 0), props, to, target);
    } else {
      animateScroll.animateTopScroll(coordinates.top + (props.offset || 0), props, to, target);
    }
  }
};

