/*
 * Tell the browser that the event listener won't prevent a scroll.
 * Allowing the browser to continue scrolling without having to
 * to wait for the listener to return.
 */
export const addPassiveEventListener = (target, eventName, listener) => {
  if (!attachedListeners.has(eventName)) {
    attachedListeners.set(eventName, new Set());
  }
  const listeners = attachedListeners.get(eventName);
  if (listeners.has(listener.name)) return;

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
  listeners.add(listener.name);
};

export const removePassiveEventListener = (target, eventName, listener) => {
  target.removeEventListener(eventName, listener);
}

const attachedListeners = new Map();
