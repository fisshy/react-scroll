import utils from './utils';
import smooth from './smooth';
import cancelEvents from './cancel-events';
import events from './scroll-events';

/*
 * Gets the easing type from the smooth prop within options.
 */
const getAnimationType = (options) => smooth[options.smooth] || smooth.defaultEasing;
/*
 * Function helper
 */
const functionWrapper = (value) => typeof value === 'function' ? value : function () { return value; };
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

const makeData = () => ({
  currentPositionY : 0,
  startPositionY : 0,
  targetPositionY : 0,
  progress : 0,
  duration : 0,
  cancel : false,

  target: null,
  containerElement: null,
  to: null,
  start: null,
  deltaTop: null,
  percent: null,
  delayTimeout: null
});

const currentPositionY = (options) => {
  const containerElement = options.data.containerElement;
  if (containerElement && containerElement !== document && containerElement !== document.body) {
    return containerElement.scrollTop;
  } else {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
      document.documentElement.scrollTop : document.body.scrollTop;
  }
};

const scrollContainerHeight = (options) => {
  const containerElement = options.data.containerElement;
  if (containerElement && containerElement !== document && containerElement !== document.body) {
    return Math.max(
      containerElement.scrollHeight,
      containerElement.offsetHeight,
      containerElement.clientHeight
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
  const data = options.data;

  // Cancel on specific events
  if (!options.ignoreCancelEvents && data.cancel) {
    if (events.registered['end']) {
      events.registered['end'](data.to, data.target, data.currentPositionY);
    }
    return
  };

  data.deltaTop = Math.round(data.targetPositionY - data.startPositionY);

  if (data.start === null) {
    data.start = timestamp;
  }

  data.progress = timestamp - data.start;

  data.percent = (data.progress >= data.duration ? 1 : easing(data.progress / data.duration));

  data.currentPositionY = data.startPositionY + Math.ceil(data.deltaTop * data.percent);

  if (data.containerElement && data.containerElement !== document && data.containerElement !== document.body) {
    data.containerElement.scrollTop = data.currentPositionY;
  } else {
    window.scrollTo(0, data.currentPositionY);
  }

  if (data.percent < 1) {
    let easedAnimate = animateScroll.bind(null, easing, options);
    requestAnimationFrameHelper.call(window, easedAnimate);
    return;
  }

  if (events.registered['end']) {
    events.registered['end'](data.to, data.target, data.currentPositionY);
  }

};

const setContainer = (options) => {
  options.data.containerElement = !options
    ? null
    : options.containerId
      ? document.getElementById(options.containerId)
      : options.container && options.container.nodeType
        ? options.container
        : document;
};

const animateTopScroll = (y, options, to, target) => {
  options.data = options.data || makeData();

  window.clearTimeout(options.data.delayTimeout);

  cancelEvents.subscribe(() => {
    options.data.cancel = true;
  });

  setContainer(options);

  options.data.start = null;
  options.data.cancel = false;
  options.data.startPositionY = currentPositionY(options);
  options.data.targetPositionY = options.absolute ? y : y + options.data.startPositionY;

  if(options.data.startPositionY === options.data.targetPositionY) {
    if (events.registered['end']) {
      events.registered['end'](options.data.to, options.data.target, options.data.currentPositionY);
    }
    return;
  }

  options.data.deltaTop = Math.round(options.data.targetPositionY - options.data.startPositionY);

  options.data.duration = functionWrapper(options.duration)(options.data.deltaTop);
  options.data.duration = isNaN(parseFloat(options.data.duration)) ? 1000 : parseFloat(options.data.duration);
  options.data.to = to;
  options.data.target = target;

  let easing = getAnimationType(options);
  let easedAnimate = animateScroll.bind(null, easing, options);

  if (options && options.delay > 0) {
    options.data.delayTimeout = window.setTimeout(() => {
      requestAnimationFrameHelper.call(window, easedAnimate);
    }, options.delay);
    return;
  }

  requestAnimationFrameHelper.call(window, easedAnimate);

};

const proceedOptions = (options) => {
  options = Object.assign({}, options);
  options.data = options.data || makeData();
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
  animateTopScroll(scrollContainerHeight(options), options);
};

const scrollMore = (toY, options) => {
  options = proceedOptions(options);
  setContainer(options);
  animateTopScroll(currentPositionY(options) + toY, options);
};

export default {
  animateTopScroll,
  getAnimationType,
  scrollToTop,
  scrollToBottom,
  scrollTo,
  scrollMore,
};