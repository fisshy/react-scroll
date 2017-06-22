var assign = require('object-assign');

var animateScroll = require('./animate-scroll');
var events = require('./scroll-events');

var __mapped = {};
var __links = [];
var __activeLink;

module.exports = {

  unmount: function() {
    __mapped = {};
    __links = [];
  },

  register: function(name, element){
    __mapped[name] = element;
    __links.push(name);
  },

  unregister: function(name) {
    delete __mapped[name];
    var linkIndex = __links.indexOf(name);
    __links = [].concat(__links.slice(0, linkIndex)).concat(__links.slice(linkIndex + 1));
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

  getLinks: function () {
    return __links;
  },

  getNextLink: function () {
    var currentIndex = __links.indexOf(__activeLink) || 0;
    var nextItem = __links[currentIndex + 1];
    return nextItem;
  },

  scrollToNext: function (props) {
    var to = this.getNextLink();
    if (to) {
      this.scrollTo(to, props);
    }
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

      var containerElement;

      if(containerId) {
        containerElement = document.getElementById(containerId);
      } else if(container && container.nodeType) {
        containerElement = container;
      } else {
        containerElement = null;
      }

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
