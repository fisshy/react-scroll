var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],

  mount: function (containerId) {
    if (typeof document !== 'undefined') {
      if (containerId) {
        this.container = document.getElementById(containerId);
        this.container.addEventListener('scroll', this.scrollHandler.bind(this));
      } else {
        document.addEventListener('scroll', this.scrollHandler.bind(this));
      }
    }
  },
  currentPositionY: function () {
    if (this.container) return this.container.scrollTop;
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

    if (this.container) {
      this.container.removeEventListener('scroll', this.scrollHandler);
    } else {
      document.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

module.exports = scrollSpy;
