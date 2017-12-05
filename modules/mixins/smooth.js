"use strict";

export default {
 /*
  * https://github.com/oblador/angular-scroll (duScrollDefaultEasing)
  */
  defaultEasing :  (x) => {
    if(x < 0.5) {
      return Math.pow(x*2, 2)/2;
    }
    return 1-Math.pow((1-x)*2, 2)/2;
  },
  /*
   * https://gist.github.com/gre/1650294
   */
  // no easing, no acceleration
  linear: (x) =>  x,
  // accelerating from zero velocity
  easeInQuad:(x) =>   x * x,
  // decelerating to zero velocity
  easeOutQuad: (x) => x * (2 - x),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (x) =>  x < .5 ? 2 * x * x : -1 + (4 - 2 * x) * x,
  // accelerating from zero velocity 
  easeInCubic: (x) => x * x * x,
  // decelerating to zero velocity π
  easeOutCubic: (x) => (--x) * x * x + 1,
  // acceleration until halfway, then deceleration 
  easeInOutCubic: (x) => x < .5 ? 4 * x * x * x : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1,
  // accelerating from zero velocity 
  easeInQuart: (x) =>  x * x * x * x,
  // decelerating to zero velocity 
  easeOutQuart: (x) =>  1 - (--x) * x * x * x,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (x) =>   x < .5 ? 8 * x * x * x * x : 1 - 8 * (--x) * x * x * x,
  // accelerating from zero velocity
  easeInQuint: (x) =>  x * x * x * x * x,
  // decelerating to zero velocity
  easeOutQuint: (x) =>  1 + (--x) * x * x * x * x,
  // acceleration until halfway, then deceleration 
  easeInOutQuint: (x) =>   x < .5 ? 16 * x * x * x * x * x : 1 + 16 * (--x) * x * x * x * x
};
