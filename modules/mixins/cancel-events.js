const addPassiveEventListener = require('./passive-event-listeners');
const events = ['mousedown', 'mousewheel', 'touchmove', 'keydown']

module.exports = {
	register : (cancelEvent) => (typeof document !== 'undefined') && events.forEach(event => addPassiveEventListener(document, event, cancelEvent))
};
