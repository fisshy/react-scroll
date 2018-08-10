'use strict';

var _reactDom = require('react-dom');

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _animateScroll = require('../mixins/animate-scroll');

var _animateScroll2 = _interopRequireDefault(_animateScroll);

var _scrollEvents = require('../mixins/scroll-events.js');

var _scrollEvents2 = _interopRequireDefault(_scrollEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentPositionY = function currentPositionY() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
};

describe('AnimateScroll', function () {

  var node = void 0;
  var node2 = void 0;
  var duration = 10;
  var waitDuration = duration * 10;

  var tallComponent = _react2.default.createElement(
    'div',
    { id: 'hugeComponent' },
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollToTop();
        } },
      'Scroll To Top!'
    ),
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollTo(100);
        } },
      'Scroll To 100!'
    ),
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollMore(10);
        } },
      'Scroll More!'
    ),
    _react2.default.createElement('div', { style: { height: '10000px' } })
  );

  var tallComponent2 = _react2.default.createElement(
    'div',
    { id: 'hugeComponent2' },
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollToTop();
        } },
      'Scroll To Top!'
    ),
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollTo(100);
        } },
      'Scroll To 100!'
    ),
    _react2.default.createElement(
      'a',
      { onClick: function onClick() {
          return _animateScroll2.default.scrollMore(10);
        } },
      'Scroll More!'
    ),
    _react2.default.createElement('div', { style: { height: '10000px' } })
  );

  beforeEach(function () {
    node = document.createElement('div');
    node2 = document.createElement('div');
    document.body.appendChild(node);
    document.body.appendChild(node2);
  });

  afterEach(function () {
    window.scrollTo(0, 0);
    node.style.cssText = "";
    node2.style.cssText = "";
    document.body.style.cssText = "";

    (0, _reactDom.unmountComponentAtNode)(node);
    (0, _reactDom.unmountComponentAtNode)(node2);
    document.body.removeChild(node);
    document.body.removeChild(node2);
    document.body.innerHtml = "";
  });

  it('renders a component taller than the window height', function () {
    (0, _reactDom.render)(tallComponent, node, function () {
      (0, _expect2.default)(node.offsetHeight > window.innerHeight).toBe(true);
    });
  });

  it('scrolls to an absolute position', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 1000);
      _animateScroll2.default.scrollTo(120, { duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position given a node as a container ', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {

      window.scrollTo(0, 0);
      node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
      document.body.style.cssText = "overflow: hidden;";

      _animateScroll2.default.scrollTo(400, { duration: duration, container: node });
      setTimeout(function () {
        (0, _expect2.default)(node.scrollTop).toEqual(400);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to an absolute position even if current position is higher', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 1000);
      _animateScroll2.default.scrollTo(200, { duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(200);

        done();
      }, waitDuration);
    });
  });

  it('scrolls to top', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 1000);
      _animateScroll2.default.scrollToTop({ duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollToBottom({ duration: duration });

      setTimeout(function () {
        var offset = 16;
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(node.offsetHeight - window.innerHeight + offset);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position relative to the current position', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 111);

      _animateScroll2.default.scrollMore(10, { duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(121);

        _animateScroll2.default.scrollMore(10, { duration: duration });

        // do it again!
        setTimeout(function () {
          (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(131);

          done();
        }, waitDuration);
      }, waitDuration);
    });
  });

  it('can take 0 as a duration argument', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollTo(120, { duration: 0 });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, 100);
    });
  });

  it('can take a function as a duration argument', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollTo(120, { duration: function duration(v) {
          return v;
        } });
      (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(0);

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, 150);
    });
  });

  it('can scroll two DIVs', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      (0, _reactDom.render)(tallComponent2, node2, function () {
        window.scrollTo(0, 0);
        node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        node2.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        document.body.style.cssText = "overflow: hidden;";

        _animateScroll2.default.scrollTo(300, { duration: duration, container: node });
        _animateScroll2.default.scrollTo(400, { duration: duration, container: node2 });
        setTimeout(function () {
          (0, _expect2.default)(node.scrollTop).toEqual(300);
          (0, _expect2.default)(node2.scrollTop).toEqual(400);
          done();
        }, waitDuration);
      });
    });
  });
});