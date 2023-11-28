import { addPassiveEventListener, removePassiveEventListener } from './passive-event-listeners';
const events = ['mousedown', 'wheel', 'touchmove', 'keydown']

export default {
  subscribe : (cancelEvent) => (typeof document !== 'undefined') && events.forEach(event => addPassiveEventListener(document, event, cancelEvent)),
};
