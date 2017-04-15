var addPassiveEventListener = require('./passive-event-listeners');
var throttle = require('lodash.throttle');

var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],
  scrollSpyContainers: [],

  mount: function (scrollSpyContainer) {
    var t = this;
    if (scrollSpyContainer) {
      // ignore events as long as an eventHandler execution is in the queue
      // The eventHandler will execute at a rate of 15fps
      var eventHandler = throttle(function(event) {
        t.scrollHandler(scrollSpyContainer);
      }, 66);

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

  scrollHandler: function (scrollSpyContainer) {
    var callbacks = this.scrollSpyContainers[this.scrollSpyContainers.indexOf(scrollSpyContainer)].spyCallbacks;
    if (callbacks) {
      for(var i = 0; i < callbacks.length; i++) {
        var position =this.currentPositionY(scrollSpyContainer);
        callbacks[i](this.currentPositionY(scrollSpyContainer));
      }
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

  unmount: function (stateHandler, spyHandler) {
    for (var i = 0; i < this.scrollSpyContainers.length; i++) {
      var callbacks = this.scrollSpyContainers[i].spyCallbacks;
      if(callbacks && callbacks.length) {
        callbacks.splice(callbacks.indexOf(spyHandler), 1);
      }
    }

    if(this.spySetState && this.spySetState.length) {
      this.spySetState.splice(this.spySetState.indexOf(stateHandler), 1);
    }

    document.removeEventListener('scroll', this.scrollHandler);
  },

  update: function() {
    for (var i = 0; i < this.scrollSpyContainers.length; i++) {
      this.scrollHandler(this.scrollSpyContainers[i]);
    }
  }
}

module.exports = scrollSpy;
