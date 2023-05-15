/*
 * Tell the browser that the event listener won't prevent a scroll.
 * Allowing the browser to continue scrolling without having to
 * to wait for the listener to return.
 */
export const addPassiveEventListener = (target, eventName, listener) => {
  let listenerName = listener.name;
  if (!listenerName) {
    listenerName = eventName;
    console.warn('Listener must be a named function.');
  }

  if (!attachedListeners.has(eventName)) attachedListeners.set(eventName, new Set());
  const listeners = attachedListeners.get(eventName);
  if (listeners.has(listenerName)) return;

  const supportsPassiveOption = (() => {
    let supportsPassiveOption = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassiveOption = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) { }
    return supportsPassiveOption;
  })();
  target.addEventListener(eventName, listener, supportsPassiveOption ? { passive: true } : false);
  listeners.add(listenerName);
};

export const removePassiveEventListener = (target, eventName, listener) => {
  target.removeEventListener(eventName, listener);
  attachedListeners.get(eventName).delete(listener.name || eventName);
}

const attachedListeners = new Map();
