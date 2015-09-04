var events = ['mousedown', 'mousewheel', 'touchmove', 'keydown']

module.exports = {
	register : function(cancelEvent) {
		if (typeof document === 'undefined') {
			return;
		}

		for(var i = 0; i < events.length; i = i + 1) {
			document.addEventListener(events[i], cancelEvent);
		}
	}
};
