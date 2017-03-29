"use strict";

module.exports = {
 /*
  * https://github.com/oblador/angular-scroll (duScrollDefaultEasing)
  */
  defaultEasing : function (x) {
    if(x < 0.5) {
      return Math.pow(x*2, 2)/2;
    }
    return 1-Math.pow((1-x)*2, 2)/2;
  },
  /*
   * https://gist.github.com/gre/1650294
   */
  // no easing, no acceleration
  linear: function (x) {
    return x;
  },
  // accelerating from zero velocity
  easeInQuad: function (x) {
    return x * x;
  },
  // decelerating to zero velocity
  easeOutQuad: function (x) {
    return x * (2 - x);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (x) {
    return x < .5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
  },
  // accelerating from zero velocity 
  easeInCubic: function (x) {
    return x * x * x;
  },
  // decelerating to zero velocity π
  easeOutCubic: function (x) {
    return (--x) * x * x + 1;
  },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (x) {
    return x < .5 ? 4 * x * x * x : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1;
  },
  // accelerating from zero velocity 
  easeInQuart: function (x) {
    return x * x * x * x;
  },
  // decelerating to zero velocity 
  easeOutQuart: function (x) {
    return 1 - (--x) * x * x * x;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (x) {
    return x < .5 ? 8 * x * x * x * x : 1 - 8 * (--x) * x * x * x;
  },
  // accelerating from zero velocity
  easeInQuint: function (x) {
    return x * x * x * x * x;
  },
  // decelerating to zero velocity
  easeOutQuint: function (x) {
    return 1 + (--x) * x * x * x * x;
  },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (x) {
    return x < .5 ? 16 * x * x * x * x * x : 1 + 16 * (--x) * x * x * x * x;
  }
};
