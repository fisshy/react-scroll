'use strict';

var addPassiveEventListener = require('./passive-event-listeners');

var events = ['mousedown', 'mousewheel', 'touchmove', 'keydown'];

module.exports = {
	register: function register(cancelEvent) {
		if (typeof document === 'undefined') {
			return;
		}

		for (var i = 0; i < events.length; i = i + 1) {
			addPassiveEventListener(document, events[i], cancelEvent);
		}
	}
};