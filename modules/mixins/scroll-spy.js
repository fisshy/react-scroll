const { addPassiveEventListener } = require('./passive-event-listeners');

const eventThrottler = (eventHandler)  => {
  let eventHandlerTimeout;
  return (event) => {
    // ignore events as long as an eventHandler execution is in the queue
    if ( !eventHandlerTimeout ) {
      eventHandlerTimeout = setTimeout(() => {
        eventHandlerTimeout = null;
        eventHandler(event);
        // The eventHandler will execute at a rate of 15fps
      }, 66);
    }
  };
};

const scrollSpy = {

  spyCallbacks: [],
  spySetState: [],
  scrollSpyContainers: [],

  mount(scrollSpyContainer) {
    if (scrollSpyContainer) {
      const eventHandler = eventThrottler((event) => {
        scrollSpy.scrollHandler(scrollSpyContainer);
      });
      scrollSpy.scrollSpyContainers.push(scrollSpyContainer);
      addPassiveEventListener(scrollSpyContainer, 'scroll', eventHandler);
    }
    
  },

  isMounted(scrollSpyContainer) {
    return scrollSpy.scrollSpyContainers.indexOf(scrollSpyContainer) !== -1;
  },

  currentPositionY(scrollSpyContainer) {
    if(scrollSpyContainer === document) {
      let supportPageOffset = window.pageXOffset !== undefined;
      let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
      return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
      document.documentElement.scrollTop : document.body.scrollTop;
    } else {
      return scrollSpyContainer.scrollTop;
    }
  },

  scrollHandler(scrollSpyContainer) {
    let callbacks = scrollSpy.scrollSpyContainers[scrollSpy.scrollSpyContainers.indexOf(scrollSpyContainer)].spyCallbacks || [];
    callbacks.forEach(c => c(scrollSpy.currentPositionY(scrollSpyContainer)))
  },

  addStateHandler(handler) {
    scrollSpy.spySetState.push(handler);
  },

  addSpyHandler(handler, scrollSpyContainer) {
    let container = scrollSpy.scrollSpyContainers[scrollSpy.scrollSpyContainers.indexOf(scrollSpyContainer)];
    
    if(!container.spyCallbacks) {
      container.spyCallbacks = [];
    }

    container.spyCallbacks.push(handler);

    handler(scrollSpy.currentPositionY(scrollSpyContainer));
  },

  updateStates() {
    scrollSpy.spySetState.forEach(s => s());
  },

  unmount(stateHandler, spyHandler) {
    scrollSpy.scrollSpyContainers.forEach(c => c.spyCallbacks && c.spyCallbacks.length && c.spyCallbacks.splice(c.spyCallbacks.indexOf(spyHandler), 1))

    if(scrollSpy.spySetState && scrollSpy.spySetState.length) {
      scrollSpy.spySetState.splice(scrollSpy.spySetState.indexOf(stateHandler), 1);
    }

    document.removeEventListener('scroll', scrollSpy.scrollHandler);
  },

  update: () => scrollSpy.scrollSpyContainers.forEach(c => scrollSpy.scrollHandler(c))
}

module.exports = scrollSpy;
