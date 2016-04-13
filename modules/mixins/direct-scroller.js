var Helpers  = require('../mixins/Helpers');
var scroller = require('../mixins/scroller');

var mappedGet = scroller.get;

// Get element by its ID attribute
scroller.get = function(name) {
  return mappedGet(name) || document.getElementById(name);
};

module.exports = scroller;
