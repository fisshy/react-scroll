var scrollSpy = {
  
  spyCallbacks: [],
  spySetState: [],

  mount: function () {
    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', this.scrollHandler.bind(this));
    }
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