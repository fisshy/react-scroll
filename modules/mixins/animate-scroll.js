var smooth = require('./smooth');

var easing = smooth.defaultEasing;

var cancelEvents = require('./cancel-events');

var events = require('./scroll-events');

/*
 * Sets the cancel trigger
 */

cancelEvents.register(function() {
  __cancel = true;
});

/*
 * Wraps window properties to allow server side rendering
 */
var currentWindowProperties = function() {
  if (typeof window !== 'undefined') {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  }
};

/*
 * Helper function to never extend 60fps on the webpage.
 */
var requestAnimationFrameHelper = (function () {
  return  currentWindowProperties() ||
          function (callback, element, delay) {
              window.setTimeout(callback, delay || (1000/60), new Date().getTime());
          };
})();


var __currentPositionY  = 0;
var __startPositionY    = 0;
var __targetPositionY   = 0;
var __progress          = 0;
var __duration          = 0;
var __cancel            = false;

var __target;
var __to;
var __start;
var __deltaTop;
var __percent;

var currentPositionY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
         document.documentElement.scrollTop : document.body.scrollTop;
};

var pageHeight = function() {
  var body = document.body;
  var html = document.documentElement;

  return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
  );
};

var animateTopScroll = function(timestamp) {
  // Cancel on specific events
  if(__cancel) { return };

  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  if (__start === null) {
    __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = (__progress >= __duration ? 1 : easing(__progress/__duration));

  __currentPositionY = __startPositionY + Math.ceil(__deltaTop * __percent);

  window.scrollTo(0, __currentPositionY);

  if(__percent < 1) {
    requestAnimationFrameHelper.call(window, animateTopScroll);
    return;
  }

  if(events.registered['end']) {
    events.registered['end'](__to, __target, __currentPositionY);
  }

};

var startAnimateTopScroll = function(y, options, to, target) {
  __start           = null;
  __cancel          = false;
  __startPositionY  = currentPositionY();
  __targetPositionY = options.absolute ? y : y + __startPositionY;
  __duration        = isNaN(parseFloat(options.duration)) ? 1000 : parseFloat(options.duration);
  __to              = to;
  __target          = target;

  requestAnimationFrameHelper.call(window, animateTopScroll);
};

var scrollToTop = function (duration) {
  startAnimateTopScroll(0, { duration : duration, absolute : true });
};

var scrollTo = function (toY, duration) {
  startAnimateTopScroll(toY, { duration : duration, absolute : true });
};

var scrollToBottom = function(duration) {
  startAnimateTopScroll(pageHeight(), { duration : duration , absolute : true});
};

var scrollMore = function(toY, duration) {
  startAnimateTopScroll(currentPositionY() + toY, { duration : duration, absolute : true });
};

module.exports = {
  animateTopScroll: startAnimateTopScroll,
  scrollToTop: scrollToTop,
  scrollToBottom: scrollToBottom,
  scrollTo: scrollTo,
  scrollMore: scrollMore,
};
