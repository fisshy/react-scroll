"use strict";

var React = require('react');

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
 * Spy helper
 */

 var spyCallbacks = [];
 var spySetState = [];

 document.addEventListener('scroll', function() {
  for(var i = 0; i < spyCallbacks.length; i = i + 1) {
    spyCallbacks[i](currentPositionY());
  }
 });

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

var __activeLink;
var __mapped            = {};
var __currentPositionY  = 0;
var __startPositionY    = 0;
var __targetPositionY   = 0;
var __progress          = 0;
var __duration          = 0;
var __cancel            = false;

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
    requestAnimationFrame(animateTopScroll);
  }

};

var startAnimateTopScroll = function(y, options) {
  __start           = null;
  __cancel          = false;
  __startPositionY  = currentPositionY();
  __targetPositionY = y + __startPositionY;
  __duration        = options.duration || 1000;

  requestAnimationFrame(animateTopScroll);
};

var Helpers = {
  reset: function() {
    __mapped = [];
    spySetState = [];
    spyCallbacks = [];
  },
  Scroll: {
    propTypes: {
      to: React.PropTypes.string.isRequired,
      offset: React.PropTypes.number
    },
    getDefaultProps: function() {
      return {offset: 0};
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

      startAnimateTopScroll(cordinates.top + this.props.offset, options);

    },
    onClick: function(event) {
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
      if(this.props.spy) {
        var to = this.props.to;
        var element = null;
        var top = 0;
        var height = 0;
        var self = this;

        spySetState.push(function() {
          if(__activeLink != to) {
            self.setState({ active : false });
          }
        });

        spyCallbacks.push(function(y) {

          if(!element) {
            element = __mapped[to];
            var cords = element.getBoundingClientRect();
            top = (cords.top + y);
            height = top + cords.height;
          }

          var offsetY = y - self.props.offset;

          if(offsetY >= top && offsetY <= height && __activeLink != to) {

            __activeLink = to;

            self.setState({ active : true });

            var length = spySetState.length;

            for(var i = 0; i < length; i = i + 1) {
              spySetState[i]();
            }

          }
        });
      }
    }
  },
  Element: {
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
    componentDidMount: function() {
      __mapped[this.props.name] = this.getDOMNode();
    },
    componentWillUnmount: function() {
      delete __mapped[this.props.name];
    }
  }
};

module.exports = Helpers;


