import utils from './utils';
import animateScroll from './animate-scroll';
import events from './scroll-events';

let __mapped = {}
let __activeLink;

export default {

  unmount: () => {
    __mapped = {};
  },

  register: (name, element) => {
    __mapped[name] = element;
  },

  unregister: (name) => {
    delete __mapped[name];
  },

  get: (name) => __mapped[name] || document.getElementById(name) || document.getElementsByName(name)[0] || document.getElementsByClassName(name)[0],

  setActiveLink: (link) => __activeLink = link,

  getActiveLink: () => __activeLink,

  scrollTo(to, props) {

    let target = this.get(to);

    if (!target) {
      console.warn("target Element not found");
      return;
    }

    props = Object.assign({}, props, { absolute: false });

    let containerId = props.containerId;
    let container = props.container;

    let containerElement;
    if (containerId) {
      containerElement = document.getElementById(containerId);
    } else if (container && container.nodeType) {
      containerElement = container;
    } else {
      containerElement = document;
    }

    props.absolute = true;

    let horizontal = props.horizontal
    let scrollOffset = utils.scrollOffset(containerElement, target, horizontal) + (props.offset || 0);

    /*
     * if animate is not provided just scroll into the view
     */
    if (!props.smooth) {
      if (events.registered['begin']) {
        events.registered['begin'](to, target);
      }

      if (containerElement === document) {
        if (props.horizontal) {
          window.scrollTo(scrollOffset, 0);
        } else {
          window.scrollTo(0, scrollOffset);
        }
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
