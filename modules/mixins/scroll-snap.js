/**
 *
 */

"use strict";

var React = require('react');
var animateScroll = require('./animate-scroll');
var scroller = require('./scroller');
var scrollSpy = require('./scroll-spy');

var cancelEvent = function (e) {
	//e.stopPropagation();
	e.stopImmediatePropagation();
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
};

var ScrollSnapMixin = {
	propTypes: {
		duration: React.PropTypes.number.isRequired,
		offset: React.PropTypes.number,
		smooth: React.PropTypes.bool
	},

	getInitialState() {
		return {
			scrolling: false,
			scrollY: 0
		}
	},

	getDefaultProps: function () {
		return {
			duration: 500,
			offset: 0,
			smooth: true

		};
	},

	componentWillMount() {
		// use capture phase here
		if (typeof document !== 'undefined') {
			document.addEventListener('wheel', this.wheelHandler, true);
			document.addEventListener('scroll', this.scrollHandler, true);
			document.addEventListener('keydown', this.keydownHandler, true);
			//document.addEventListener('touchend', this.scrollHandler, true);
		}
	},

	componentDidMount() {
		this.setState({ scrollY: scrollSpy.currentPositionY() });
	},

	componentWillUnmount() {
		//window.removeEventListener('resize', this.handleResize);
		if (typeof document !== 'undefined') {
			document.removeEventListener('wheel', this.wheelHandler);
			document.removeEventListener('scroll', this.scrollHandler);
			document.removeEventListener('keydown', this.keydownHandler);
			//document.removeEventListener('touchend', this.scrollHandler);
		}
	},

	keydownHandler: function(e) {
		var direction = this.getKeydownDirection(e);

		this.scrollToDirection(e, direction);
	},

	scrollHandler: function(e) {
		if (this.state.scrolling) {
			return
		}
		cancelEvent(e);

		var direction = this.getScrollDirection(e);

		if (!direction) {
			return
		}

		this.scrollToDirection(e, direction);
	},

	wheelHandler: function(e) {
		// todo если зажата кнопка, типа ctrl, то нужно игнорировать этот ивент

		// todo добавить проверку на поддержку нативного scroll snap
		cancelEvent(e);

		var direction = this.getWheelDirection(e);

		this.scrollToDirection(e, direction);
	},

	scrollToDirection: function(e, direction) {
		if (this.state.scrolling) {
			return
		}

		this.setState({ scrolling: true });

		// We need to get current element
		var nearestElements = this.getCurrentWithSiblings();

		if (direction === 1 && nearestElements[2] !== null) {
			this.scrollTo(nearestElements[2].name);
		} else if (direction === -1 && nearestElements[0] !== null) {
			this.scrollTo(nearestElements[0].name);
		}

		// it is needed to prevent multiple event handling till animation not finished
		var self = this;

		setTimeout(function() {
			self.setState({ scrolling: false, scrollY: window.pageYOffset })
		}, self.props.duration + 30); // interval must be bigger than animation
		// duration for preventing bug with trigger infinity loop
	},

	/**
	 * Function determines the elements nearest to visible one
	 *
	 * @returns string with element name
	 */
	getCurrentWithSiblings: function() {
		var elements = scroller.getAll();
		var elementsCoordinates = [];

		for (var e in elements) {
			if( elements.hasOwnProperty(e) ) {
				//elementsCoordinates[e] = elements[e].getBoundingClientRect()
				var rectObject = elements[e].getBoundingClientRect();
				rectObject.name = e;
				elementsCoordinates.push(rectObject);
			}
		}

		//var nearestElements = this.getMax(elementsCoordinates);

		return this.getMax(elementsCoordinates);
	},

	/**
	 * Function returns an array of three elements: visible, upper and lower
	 *
	 * @param elements is an array of all sections
	 * @returns [] with three elements
	 */
	getMax: function(elements) {
		var max = -Infinity;
		var upperElement, maxElement, lowerElement;

		for (var i = 0; i < elements.length; i++) {
		//for(var e in elements) {
			if (elements[i].top > max && elements[i].top <= 0) {
				max = elements[i].top;

				if (elements[i].top !== 0) {
					// for those cases when the upper part of the visible element does
					// not fit on the viewport
					upperElement = elements[i];
				} else {
					// previous element become upper if exists
					upperElement = maxElement || null;
				}
				maxElement = elements[i];

				if (typeof elements[i+1] === 'undefined') {
					lowerElement = null
				} else {
					lowerElement = elements[i+1]
				}
			}
		}

		return [upperElement, maxElement, lowerElement];
	},

	/**
	 *
	 *
	 * @param e is an event object
	 * @returns {number} 1 - go up; -1 - go down
	 */
	getWheelDirection: function(e) {
		if (e.deltaY > 0) {
			return 1
		}

		return -1
	},

	getScrollDirection: function(e) {
		var currentPositionY = window.pageYOffset;

		/*if (e.type === 'touchend') {
			currentPositionY = e.touches[0].clientY;
		} else {
			currentPositionY = window.pageYOffset;
		}*/

		var scrolledY = this.state.scrollY - currentPositionY;

		if (scrolledY > 0) {
			return -1
		} else if (scrolledY < 0) {
			return 1
		}

		return false;
	},

	getKeydownDirection: function (e) {
		if (e.which === 40 || e.which === 34) {
			e.stopPropagation();
			e.preventDefault();

			return 1;
		} else if (e.which === 38 || e.which === 33) {
			e.stopPropagation();
			e.preventDefault();

			return -1;
		} else {
			return false;
		}
	},

	scrollTo : function(to) {
		if (scroller.getTarget() === null) {
			scroller.scrollTo(to, this.props.smooth, this.props.duration, this.props.offset);
			scroller.flushTarget();
		}
	}
};

module.exports = ScrollSnapMixin;