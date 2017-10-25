const { addPassiveEventListener, removePassiveEventListener } = require('./passive-event-listeners');
const events = ['mousedown', 'mousewheel', 'touchmove', 'keydown']

module.exports = {
  subscribe : (cancelEvent) => (typeof document !== 'undefined') && events.forEach(event => addPassiveEventListener(document, event, cancelEvent)),
  unsubscribe : (cancelEvent) => (typeof document !== 'undefined') && events.forEach(event => removePassiveEventListener(document, event, cancelEvent))
};
