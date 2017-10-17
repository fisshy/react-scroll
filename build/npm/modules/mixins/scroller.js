'use strict';

var assign = require('object-assign');

var utils = require('./utils');
var animateScroll = require('./animate-scroll');
var events = require('./scroll-events');

var __mapped = {};
var __activeLink;

module.exports = {

  unmount: function unmount() {
    __mapped = {};
  },

  register: function register(name, element) {
    __mapped[name] = element;
  },

  unregister: function unregister(name) {
    delete __mapped[name];
  },

  get: function get(name) {
    return __mapped[name] || document.getElementById(name);
  },

  setActiveLink: function setActiveLink(link) {
    __activeLink = link;
  },

  getActiveLink: function getActiveLink() {
    return __activeLink;
  },

  scrollTo: function scrollTo(to, props) {

    /*
    * get the mapped DOM element
    */

    var target = this.get(to);

    if (!target) {
      console.warn("target Element not found");
      return;
    }

    props = assign({}, props, { absolute: false });

    if (events.registered['begin']) {
      events.registered['begin'](to, target);
    }

    var containerId = props.containerId;
    var container = props.container;

    var containerElement;
    if (containerId) {
      containerElement = document.getElementById(containerId);
    } else if (container && container.nodeType) {
      containerElement = container;
    } else {
      containerElement = utils.getScrollParent(target);
    }

    props.absolute = true;
    var scrollOffset;
    if (containerElement === document) {
      scrollOffset = target.offsetTop;
    } else {
      var coordinates = target.getBoundingClientRect();
      scrollOffset = containerElement.scrollTop + coordinates.top - containerElement.offsetTop;
    }

    scrollOffset += props.offset || 0;

    /*
     * if animate is not provided just scroll into the view
     */
    if (!props.smooth) {
      if (containerElement === document) {
        // window.scrollTo accepts only absolute values so body rectangle needs to be subtracted
        window.scrollTo(0, scrollOffset);
      } else {
        containerElement.scrollTop = scrollOffset;
      }

      if (events.registered['end']) {
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