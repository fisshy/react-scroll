var scrollSpy = {

  spyCallbacks: [],
  spySetState: [],
  container: null,

  mount: function (containerId) {
    if (typeof document !== 'undefined') {
      this.container = document.getElementById(containerId);
      this.container.addEventListener('scroll', this.scrollHandler.bind(this));
    }
  },
  currentPositionY: function () {
    return this.container.scrollTop;
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

    this.container.removeEventListener('scroll', this.scrollHandler);
  }
}

module.exports = scrollSpy;
