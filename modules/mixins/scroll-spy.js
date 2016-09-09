var addPassiveEventListener = require('./passive-event-listeners');

var eventThrottler = function(eventHandler) {
  var eventHandlerTimeout;
  return function(event) {
    // ignore events as long as an eventHandler execution is in the queue
    if ( !eventHandlerTimeout ) {
      eventHandlerTimeout = setTimeout(function() {
        eventHandlerTimeout = null;
        eventHandler(event);
        // The eventHandler will execute at a rate of 15fps
      }, 66);
    }
  };
};

var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],
  scrollSpyContainers: [],
  recalcElementSize : false,

  mount: function (scrollSpyContainer) {
    var t = this;
    if (scrollSpyContainer) {
      var eventHandler = eventThrottler(function(event) {
        t.scrollHandler(scrollSpyContainer);
      });
      this.scrollSpyContainers.push(scrollSpyContainer);
      addPassiveEventListener(scrollSpyContainer, 'scroll', eventHandler);
    }
  },

  isMounted: function (scrollSpyContainer) {
    return this.scrollSpyContainers.indexOf(scrollSpyContainer) !== -1;
  },

  currentPositionY: function (scrollSpyContainer) {
    if(scrollSpyContainer === document) {
      var supportPageOffset = window.pageXOffset !== undefined;
      var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
      return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
      document.documentElement.scrollTop : document.body.scrollTop;
    } else {
      return scrollSpyContainer.scrollTop;
    }
  },

  recalculateElementSizes: function(){
    this.recalcElementSize = true;
  },

  scrollHandler: function (scrollSpyContainer) {
    var callbacks = this.scrollSpyContainers[this.scrollSpyContainers.indexOf(scrollSpyContainer)].spyCallbacks;
    if (callbacks) {
      for(var i = 0; i < callbacks.length; i++) {
        var position =this.currentPositionY(scrollSpyContainer);
        callbacks[i](this.currentPositionY(scrollSpyContainer), this.recalcElementSize);
      }
      this.recalcElementSize = false;
    }
  },

  addStateHandler: function(handler){
    this.spySetState.push(handler);
  },

  addSpyHandler: function(handler, scrollSpyContainer) {
    var container = this.scrollSpyContainers[this.scrollSpyContainers.indexOf(scrollSpyContainer)];
    if(!container.spyCallbacks) {
      container.spyCallbacks = [];
    }
    container.spyCallbacks.push(handler);
  },

  updateStates: function(){
    var length = this.spySetState.length;

    for(var i = 0; i < length; i++) {
      this.spySetState[i]();
    }
  },

  unmount: function () {
    for (var i = 0; i < this.scrollSpyContainers.length; i++) {
      this.scrollSpyContainers[i].spyCallbacks = [];
    }
    this.spySetState = [];

    document.removeEventListener('scroll', this.scrollHandler);
  },

  update: function() {
    for (var i = 0; i < this.scrollSpyContainers.length; i++) {
      this.scrollHandler(this.scrollSpyContainers[i]);
    }
  }
}

module.exports = scrollSpy;
