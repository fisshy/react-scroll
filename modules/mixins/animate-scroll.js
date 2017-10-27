const assign = require('object-assign');
const utils = require('./utils');
const smooth = require('./smooth');
const cancelEvents = require('./cancel-events');
const events = require('./scroll-events');

/*
 * Gets the easing type from the smooth prop within options.
 */
const getAnimationType = (options) => {
  return smooth[options.smooth] || smooth.defaultEasing;
};

/*
 * Function helper
 */
const functionWrapper = (value) => {
  return typeof value === 'function' ? value : function () { return value; };
};

/*
 * Wraps window properties to allow server side rendering
 */
const currentWindowProperties = () => {
  if (typeof window !== 'undefined') {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  }
};

/*
 * Helper function to never extend 60fps on the webpage.
 */
const requestAnimationFrameHelper = (() => {
  return currentWindowProperties() ||
    function (callback, element, delay) {
      window.setTimeout(callback, delay || (1000 / 60), new Date().getTime());
    };
})();


let __currentPositionY = 0;
let __startPositionY = 0;
let __targetPositionY = 0;
let __progress = 0;
let __duration = 0;
let __cancel = false;

let __target;
let __containerElement;
let __to;
let __start;
let __deltaTop;
let __percent;
let __delayTimeout;

cancelEvents.subscribe(() => {
  __cancel = true;
});

const currentPositionY = () => {
  if (__containerElement && __containerElement !== document && __containerElement !== document.body) {
    return __containerElement.scrollTop;
  } else {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
      document.documentElement.scrollTop : document.body.scrollTop;
  }
};

const scrollContainerHeight = () => {
  if (__containerElement && __containerElement !== document && __containerElement !== document.body) {
    return Math.max(
      __containerElement.scrollHeight,
      __containerElement.offsetHeight,
      __containerElement.clientHeight
    );
  } else {
    let body = document.body;
    let html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }
};

const animateScroll = (easing, options, timestamp) => {

  // Cancel on specific events
  if (!options.ignoreCancelEvents && __cancel) {
    if (events.registered['end']) {
      events.registered['end'](__to, __target, __currentPositionY);
    }
    return
  };

  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  if (__start === null) {
    __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = (__progress >= __duration ? 1 : easing(__progress / __duration));

  __currentPositionY = __startPositionY + Math.ceil(__deltaTop * __percent);

  if (__containerElement && __containerElement !== document && __containerElement !== document.body) {
    __containerElement.scrollTop = __currentPositionY;
  } else {
    window.scrollTo(0, __currentPositionY);
  }

  if (__percent < 1) {
    let easedAnimate = animateScroll.bind(null, easing, options);
    requestAnimationFrameHelper.call(window, easedAnimate);
    return;
  }

  if (events.registered['end']) {
    events.registered['end'](__to, __target, __currentPositionY);
  }

};

const setContainer = (options) => {
  __containerElement = !options
    ? null
    : options.containerId
      ? document.getElementById(options.containerId)
      : options.container && options.container.nodeType
        ? options.container
        : options.element && options.element.nodeType
          ? utils.getScrollParent(options.element)
          : document;
};

const animateTopScroll = (y, options, to, target) => {

  window.clearTimeout(__delayTimeout);

  setContainer(options);

  __start = null;
  __cancel = false;
  __startPositionY = currentPositionY();
  __targetPositionY = options.absolute ? y : y + __startPositionY;
  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  __duration = functionWrapper(options.duration)(__deltaTop);
  __duration = isNaN(parseFloat(__duration)) ? 1000 : parseFloat(__duration);
  __to = to;
  __target = target;

  let easing = getAnimationType(options);
  let easedAnimate = animateScroll.bind(null, easing, options);

  if (options && options.delay > 0) {
    __delayTimeout = window.setTimeout(() => {
      requestAnimationFrameHelper.call(window, easedAnimate);
    }, options.delay);
    return;
  }

  requestAnimationFrameHelper.call(window, easedAnimate);

};

const proceedOptions = (options) => {
  if (options && options.nodeType) {
    options = { element: options };
  } else {
    options = assign({}, options);
  }
  options.absolute = true;

  return options;
}

const scrollToTop = (options) => {
  animateTopScroll(0, proceedOptions(options));
};

const scrollTo = (toY, options) => {
  animateTopScroll(toY, proceedOptions(options));
};

const scrollToBottom = (options) => {
  options = proceedOptions(options);
  setContainer(options);
  animateTopScroll(scrollContainerHeight(), options);
};

const scrollMore = (toY, options) => {
  options = proceedOptions(options);
  setContainer(options);
  animateTopScroll(currentPositionY() + toY, options);
};

module.exports = {
  animateTopScroll,
  getAnimationType,
  scrollToTop,
  scrollToBottom,
  scrollTo,
  scrollMore,
};
