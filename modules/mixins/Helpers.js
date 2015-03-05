"use strict";

var React = require('react');

var smooth = require('./smooth');

var easing = smooth.defaultEasing;

/* 
 * Helper function to never extend 60fps on the webpage.
 */ 
var requestAnimationFrame = (function () {
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          function (callback, element, delay) {
              window.setTimeout(callback, delay || (1000/60));
          };
})();

var __mapped            = {};
var __currentPositionY  = 0;
var __startPositionY    = 0;
var __targetPositionY   = 0;
var __progress          = 0;
var __duration          = 0;

var __start;
var __deltaTop;
var __percent;

var currentPositionY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return  supportPageOffset ? window.pageYOffset : isCSS1Compat ? 
          document.documentElement.scrollTop : document.body.scrollTop;
};

var animateTopScroll = function(timestamp) {
  /*
   * Set start time
   */

  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  if (__start === null) {
    __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = (__progress >= __duration ? 1 : easing(__progress/__duration));

  __currentPositionY = __startPositionY + Math.ceil(__deltaTop * __percent);

  window.scrollTo(0, __currentPositionY);

  if(__percent < 1) {
    requestAnimationFrame(animateTopScroll);
  }

};

var startAnimateTopScroll = function(y, options) {
  __start           = null;
  __startPositionY  = currentPositionY();
  __targetPositionY = y + __startPositionY;
  __duration        = options.duration || 1000;

  requestAnimationFrame(animateTopScroll);
};

var Helpers = {
  Scroll: {
    propTypes: {
      to: React.PropTypes.string.isRequired
    },
    scrollTo : function(to) {
      
      /*
       * get the mapped DOM element
       */

      var target = __mapped[to];
      
      if(!target) {
        throw new Error("target Element not found");
      }

      var cordinates = target.getBoundingClientRect();

      /*
       * if smooth is not provided just scroll into the view
       */

      if(!this.props.smooth) { 
        window.scrollTo(0, cordinates.top);
        return;
      }

      /*
       * Animate scrolling
       */
      
      var options = { 
        duration : this.props.duration 
      };

      startAnimateTopScroll(cordinates.top, options);

    },
    onClick: function() {
      
      /*
       * give the posibility to override onClick
       */
      
      if(this.props.onClick) {
        this.props.onClick(event);
      }

      /*
       * dont bubble the navigation
       */

      if (event.stopPropagation) event.stopPropagation();
      if (event.preventDefault) event.preventDefault();

      /*
       * do the magic!
       */

      this.scrollTo(this.props.to);

    },
    componentDidMount: function() {
      
    }
  },
  Element: {
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
    componentDidMount: function() {
      __mapped[this.props.name] = this.getDOMNode();
    }
  },
  Spy: {
    componentDidMount: function() {
    }
  }
};

module.exports = Helpers;


