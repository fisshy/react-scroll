"use strict";

var React = require('react');

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

var __mapped = {};
var __currentPositionY = 0;
var __targetPositionY = 0;
var __speed = 45;
var __direction;

var currentPositionY = function() {
	var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
	__currentPositionY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? 
												document.documentElement.scrollTop : document.body.scrollTop;
	return __currentPositionY;
};

var setDirection = function() {
	__direction = __targetPositionY > __currentPositionY ? "down" : "up";
};

var animateTopScroll = function(y) {
	switch(__direction) {
		case "down":
			__currentPositionY = __currentPositionY + __speed;
		
			if(__currentPositionY >= __targetPositionY) {
				console.log(__targetPositionY, __currentPositionY);
				window.scrollTo(0, __targetPositionY);
				return;
			}
			break;
		case "up":
			__currentPositionY = __currentPositionY - __speed;
		
			if(__currentPositionY <= __targetPositionY) {
				console.log(__targetPositionY, __currentPositionY);
				window.scrollTo(0, __targetPositionY);
				return;
			}
			break;
	}

	window.scrollTo(0, __currentPositionY);

	requestAnimationFrame(animateTopScroll);
};

var startAnimateTopScroll = function(y) {
	__targetPositionY = y;
	currentPositionY();
	__targetPositionY = __targetPositionY + __currentPositionY
	setDirection();

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

			if(!this.props.smooth) { /* Should look into browser compability for this one*/
				window.scrollTo(0, cordinates.top);
				return;
			}

			/*
			 * Animate scrolling
			 */
			
			var options = {};

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


