var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],

  mount: function (stateHandler, spyHandler) {
    this.addHandler('spySetState', stateHandler);
    this.addHandler('spyCallbacks', spyHandler);
  },

  currentPositionY: function () {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
            document.documentElement.scrollTop : document.body.scrollTop;
  },

  scrollHandler: function () {
    for(var i = 0; i < this.spyCallbacks.length; i++) {
      this.spyCallbacks[i](this.currentPositionY());
    }
  },

  hasHandlers: function() {
    return this.spyCallbacks.length || this.spySetState.length;
  },

  addHandler: function(queueKey, handler) {
    if (handler && this[queueKey]) {
      if (document && !this.hasHandlers()) {
        this._scrollHandler = this.scrollHandler.bind(this);
        document.addEventListener('scroll', this._scrollHandler);
      }
      this[queueKey].push(handler);
    }
  },

  removeHandler: function(queueKey, handler) {
    var queue = this[queueKey] || [];
    var i = queue.indexOf(handler);
    if (i !== -1) {
      this[queueKey] = queue.splice(i, 1);
    }
    if (document && !this.hasHandlers()) {
      document.removeEventListener('scroll', this._scrollHandler);
    }
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