var smooth = require('./smooth');

var easing = smooth.defaultEasing;

var cancelEvents = require('./cancel-events');

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
var requestAnimationFrame = (function () {
  return  currentWindowProperties() ||
          function (callback, element, delay) {
              window.setTimeout(callback, delay || (1000/60));
          };
})();


var __currentPositionY  = 0;
var __startPositionY    = 0;
var __targetPositionY   = 0;
var __progress          = 0;
var __duration          = 0;
var __cancel            = false;

//added for div element /container
var __parentsLast       = 0;
var __parentsDuration   = 0;
var __parents           = false;
var __currentParent     = false;
var __elemPositionY     = false;

var __start;
var __deltaTop;
var __percent;

var currentPositionY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
         document.documentElement.scrollTop : document.body.scrollTop;
};

var animateTopScroll = function(timestamp) {
  // Cancel on specific events
  if(__cancel) { return; }

  if (__start === null) {
      __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = (__progress >= __duration ? 1 : easing(__progress/__duration));
  

  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  __currentPositionY = __startPositionY + Math.ceil(__deltaTop * __percent);

  window.scrollTo(0, __currentPositionY);

  if (__percent < 1){
    requestAnimationFrame(animateTopScroll);   
  } else if (__parents) {
    console.log(__parents, 'parents in origin');
    __start = null;
    __startPositionY  = currentPositionY();
    __currentParent = __parents[__parentsLast];
    __targetPositionY = Math.round(__parents[__parentsLast - 1].offsetTop);
    console.log(__targetPositionY, 'target positiony in else if for big');
    console.log(__startPositionY, 'startpositiony in else if for big');

    requestAnimationFrame(animateParentScroll);
    // __currentParent = __parents[0];
    // __targetPositionY = __elemPositionY;
    // console.log(__targetPositionY, 'targetPositionY after for loop');
    // requestAnimationFrame(animateParentScroll);
  }
};

var animateParentScroll = function(timestamp) {
  // Cancel on specific events
  if(__cancel) { return; }

  if (__start === null) {
      __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = (__progress >= __parentsDuration ? 1 : easing(__progress/__parentsDuration));
  console.log(__percent);
  // console.log(__targetPositionY, 'targetPositionY');

  __currentPositionY = Math.ceil(__targetPositionY * __percent);
  __currentParent.scrollTop = __currentPositionY;
  console.log(__currentPositionY, 'currentpositionY');

  if (__percent < 1){
    requestAnimationFrame(animateParentScroll);   
  } else if (__parentsLast > 0) {
    __start = null;
    console.log(__parents, 'parents before');
    console.log('animate parent scroll');
    __parentsLast--;
    __currentParent = __parents[__parentsLast];
    console.log(__parentsLast, 'last parent');
    console.log(__currentParent, 'current parent');
    if (__parentsLast !== 0) {
      __targetPositionY = __parents[__parentsLast-1].offsetTop;
    } else {
      __targetPositionY = __elemPositionY;
    }
    console.log(__targetPositionY, 'target position in else if');
    console.log(__parents, 'paretns');
    console.log(__elemPositionY, 'elem');
    console.log(__startPositionY, 'start');
    console.log(__currentPositionY, 'current');


    requestAnimationFrame(animateParentScroll);
  }

};

var startAnimateTopScroll = function(y, options, parents, elemOffset) {
  __start           = null;
  __cancel          = false;
  __parents         = false;
  __parentsLast   = 0;
  __parentsDuration = 0;
  __currentParent   = false;
  __elemPositionY   = elemOffset;
  __startPositionY  = currentPositionY();
  __targetPositionY = y + __startPositionY;
  __duration        = options.duration || 1000;

  if (parents.length > 0) {
    console.log('hello');
    __parents         = parents;  
    __parentsLast     = parents.length - 1;
    console.log(__parents, 'parents');
    __parentsDuration = options.duration/2;
    __duration        = options.duration - __parentsDuration || 1000;
    __targetPositionY = parents[__parentsLast].offsetTop;
  }
  requestAnimationFrame(animateTopScroll);
};

module.exports = {
  animateTopScroll: startAnimateTopScroll
};
