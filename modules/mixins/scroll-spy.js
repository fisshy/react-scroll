var spyCallbacks = [];
var spySetState = [];

var currentPositionY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
          document.documentElement.scrollTop : document.body.scrollTop;
};

if (typeof document !== 'undefined') {
  document.addEventListener('scroll', function() {
    for(var i = 0; i < spyCallbacks.length; i = i + 1) {
      spyCallbacks[i](currentPositionY());
    }
  });
}

module.exports = {
  unmount: function(){
    spySetState = [];
    spyCallbacks = [];
  },

  addStateHandler: function(handler){
    spySetState.push(handler);
  },

  addSpyHandler: function(handler){
    spyCallbacks.push(handler);
  },

  updateStates: function(){

    var length = spySetState.length;

    for(var i = 0; i < length; i = i + 1) {
      spySetState[i]();
    }

  }
};
