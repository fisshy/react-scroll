var Helpers  = require('./Helpers');

var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],

  mount: function (scrollSpyContainer) {
    if (typeof scrollSpyContainer !== 'undefined') {
      var eventHandler = Helpers.eventThrottler(function(event) {
  			this.scrollHandler(scrollSpyContainer);
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
