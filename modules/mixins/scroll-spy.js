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

  mount: function (scrollSpyContainer) {
    var t = this;
    if (scrollSpyContainer) {
      var eventHandler = eventThrottler(function(event) {
  			t.scrollHandler(scrollSpyContainer);
  		});
      scrollSpyContainer.addEventListener('scroll', eventHandler);
    }
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
    for(var i = 0; i < this.spyCallbacks.length; i++) {
      this.spyCallbacks[i](this.currentPositionY(scrollSpyContainer));
    }
  },

  addStateHandler: function(handler){
    this.spySetState.push(handler);
  },

  addSpyHandler: function(handler){
    this.spyCallbacks.push(handler);
  },

  updateStates: function(){
    var length = this.spySetState.length;

    for(var i = 0; i < length; i++) {
      this.spySetState[i]();
    }
  },
  unmount: function () {
    this.spyCallbacks = [];
    this.spySetState = [];

    document.removeEventListener('scroll', this.scrollHandler);
  }
}

module.exports = scrollSpy;
