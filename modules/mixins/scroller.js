const assign = require('object-assign');

const utils = require('./utils');
const animateScroll = require('./animate-scroll');
const events = require('./scroll-events');

let __mapped = {}
let __activeLink;

module.exports = {

  unmount: () => {
    __mapped = {};
  },

  register: (name, element) => {
    __mapped[name] = element;
  },

  unregister: (name) => {
    delete __mapped[name];
  },

  get: (name) => __mapped[name] || document.getElementById(name) || document.getElementsByName(name)[0],

  setActiveLink: (link) => __activeLink = link,

  getActiveLink: () => __activeLink,

  scrollTo(to, props) {

      let target = this.get(to);

      if(!target) {
        console.warn("target Element not found");
        return;
      }

      props = assign({}, props, { absolute : false });

      let containerId = props.containerId;
      let container = props.container;

      let containerElement;
      if(containerId) {
        containerElement = document.getElementById(containerId);
      } else if(container && container.nodeType) {
        containerElement = container;
      } else {
        containerElement = utils.getScrollParent(target);
      }

      if(events.registered['begin']) {
        events.registered['begin'](to, target);
      }

      props.absolute = true;

      let scrollOffset;
      if (containerElement === document) {
        scrollOffset = target.offsetTop;
      } else {
        let style = getComputedStyle(containerElement);
        let isRelative = style.position === "relative";
        scrollOffset = isRelative ? target.offsetTop : (target.offsetTop - containerElement.offsetTop);
      }

      scrollOffset += (props.offset || 0);

      scrollOffset += (props.scrollOffset || 0);

      /*
       * if animate is not provided just scroll into the view
       */
      if(!props.smooth) {
        if (containerElement === document) {
          // window.scrollTo accepts only absolute values so body rectangle needs to be subtracted
          window.scrollTo(0, scrollOffset);
        } else {
          containerElement.scrollTop = scrollOffset;
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
