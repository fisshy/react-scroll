import { render } from 'react-dom'

export var currentPositionY = function () {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
    document.documentElement.scrollTop : document.body.scrollTop;
};

export var renderHorizontal = function (component, node, callback) {
  document.body.setAttribute('style', 'display: inline-block;')
  return render(component, node, callback);
}