var assign = require('object-assign');

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
    return __mapped[name] || document.getElementById(name);
  },

  setActiveLink: function(link) {
    __activeLink = link;
  },

  getActiveLink: function() {
    return __activeLink;
  },

  scrollTo: function(to, props) {

     /*
     * get the mapped DOM element
     */

      var target = this.get(to);

      if(!target) {
        console.warn("target Element not found");
        return;
      }

      props = assign({}, props, { absolute : false });


      if(events.registered['begin']) {
        events.registered['begin'](to, target);
      }

      var containerId = props.containerId;
	  var container = props.container;
	  
      var containerElement = containerId ? document.getElementById(containerId) : (container && container.nodeType) ? container : null;

      var scrollOffset;

      if((containerId || container) && containerElement) {
        props.absolute = true;
        if(containerElement !== target.offsetParent) {
          if(!containerElement.contains(target)) {
            throw new Error('Container with ID ' + (containerId  || container) + ' is not a parent of target ' + to);
          } else {
            throw new Error('Container with ID ' + (containerId  || container)  + ' is not a positioned element');
          }
        }

        scrollOffset = target.offsetTop;
      } else {
        var coordinates = target.getBoundingClientRect();
        scrollOffset = coordinates.top;
      }

      scrollOffset += (props.offset || 0);


      /*
       * if animate is not provided just scroll into the view
       */
      if(!props.smooth) {
        if((containerId  || container) && containerElement) {
          containerElement.scrollTop = scrollOffset;
        } else {
          // window.scrollTo accepts only absolute values so body rectangle needs to be subtracted
          var bodyRect = document.body.getBoundingClientRect();
          window.scrollTo(0, scrollOffset - bodyRect.top);
        }

        if(events.registered['end']) {
          events.registered['end'](to, target);
        }

        return;
      }

      /*
       * Animate scrolling
       */

      animateScroll.animateTopScroll(scrollOffset, props, to, target);
  }
};
