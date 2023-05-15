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
  currentPosition: 0,
  startPosition: 0,
  targetPosition: 0,
  progress: 0,
  duration: 0,
  cancel: false,

  target: null,
  containerElement: null,
  to: null,
  start: null,
  delta: null,
  percent: null,
  delayTimeout: null
});

const currentPositionX = (options) => {
  const containerElement = options.data.containerElement;
  if (containerElement && containerElement !== document && containerElement !== document.body) {
    return containerElement.scrollLeft;
  } else {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    return supportPageOffset ? window.pageXOffset : isCSS1Compat ?
      document.documentElement.scrollLeft : document.body.scrollLeft;
  }
};

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

const scrollContainerWidth = (options) => {
  const containerElement = options.data.containerElement;
  if (containerElement && containerElement !== document && containerElement !== document.body) {
    return containerElement.scrollWidth - containerElement.offsetWidth;
  } else {
    let body = document.body;
    let html = document.documentElement;

    return Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );
  }
};

const scrollContainerHeight = (options) => {
  const containerElement = options.data.containerElement;
  if (containerElement && containerElement !== document && containerElement !== document.body) {
    return containerElement.scrollHeight - containerElement.offsetHeight;
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

  data.delta = Math.round(data.targetPosition - data.startPosition);

  if (data.start === null) {
    data.start = timestamp;
  }

  data.progress = timestamp - data.start;

  data.percent = (data.progress >= data.duration ? 1 : easing(data.progress / data.duration));

  data.currentPosition = data.startPosition + Math.ceil(data.delta * data.percent);

  if (data.containerElement && data.containerElement !== document && data.containerElement !== document.body) {
    if (options.horizontal) {
      data.containerElement.scrollLeft = data.currentPosition;
    } else {
      data.containerElement.scrollTop = data.currentPosition;
    }
  } else {
    if (options.horizontal) {
      window.scrollTo(data.currentPosition, 0);
    } else {
      window.scrollTo(0, data.currentPosition);
    }
  }

  if (data.percent < 1) {
    let easedAnimate = animateScroll.bind(null, easing, options);
    requestAnimationFrameHelper.call(window, easedAnimate);
    return;
  }

  if (events.registered['end']) {
    events.registered['end'](data.to, data.target, data.currentPosition);
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

const animateTopScroll = (scrollOffset, options, to, target) => {
  options.data = options.data || makeData();

  window.clearTimeout(options.data.delayTimeout);

  const setCancel = () => {
    options.data.cancel = true;
  };
  cancelEvents.subscribe(setCancel);

  setContainer(options);

  options.data.start = null;
  options.data.cancel = false;
  options.data.startPosition = options.horizontal ? currentPositionX(options) : currentPositionY(options);
  options.data.targetPosition = options.absolute
    ? scrollOffset
    : scrollOffset + options.data.startPosition;

  if (options.data.startPosition === options.data.targetPosition) {
    if (events.registered['end']) {
      events.registered['end'](options.data.to, options.data.target, options.data.currentPosition);
    }
    return;
  }

  options.data.delta = Math.round(options.data.targetPosition - options.data.startPosition);

  options.data.duration = functionWrapper(options.duration)(options.data.delta);
  options.data.duration = isNaN(parseFloat(options.data.duration)) ? 1000 : parseFloat(options.data.duration);
  options.data.to = to;
  options.data.target = target;

  let easing = getAnimationType(options);
  let easedAnimate = animateScroll.bind(null, easing, options);

  if (options && options.delay > 0) {
    options.data.delayTimeout = window.setTimeout(() => {
      if (events.registered['begin']) {
        events.registered['begin'](options.data.to, options.data.target);
      }
      requestAnimationFrameHelper.call(window, easedAnimate);
    }, options.delay);
    return;
  }

  if (events.registered['begin']) {
    events.registered['begin'](options.data.to, options.data.target);
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

const scrollTo = (toPosition, options) => {
  animateTopScroll(toPosition, proceedOptions(options));
};

const scrollToBottom = (options) => {
  options = proceedOptions(options);
  setContainer(options);
  animateTopScroll(options.horizontal
    ? scrollContainerWidth(options)
    : scrollContainerHeight(options),
    options);
};

const scrollMore = (toPosition, options) => {
  options = proceedOptions(options);
  setContainer(options);
  const currentPosition = options.horizontal ? currentPositionX(options) : currentPositionY(options)
  animateTopScroll(toPosition + currentPosition, options);
};

export default {
  animateTopScroll,
  getAnimationType,
  scrollToTop,
  scrollToBottom,
  scrollTo,
  scrollMore,
};