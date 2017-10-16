'use strict';

var _reactDom = require('react-dom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

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

  var node = document.createElement('div');

  document.body.innerHtml = "";

  document.body.appendChild(node);

  var duration = 10;

  // the bigger the difference between the 2 the better,
  // For some reason, sometimes test just fail because the animation did complete in time!
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

  afterEach(function () {
    window.scrollTo(0, 0);
    node.style.cssText = "";
    document.body.style.cssText = "";

    (0, _reactDom.unmountComponentAtNode)(node);
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
        (0, _expect2.default)(window.scrollY).toEqual(120);
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
        (0, _expect2.default)(window.scrollY).toEqual(200);

        done();
      }, waitDuration);
    });
  });

  it('scrolls to top', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 1000);
      _animateScroll2.default.scrollToTop({ duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollToBottom({ duration: duration });

      setTimeout(function () {
        var offset = 16;

        (0, _expect2.default)(window.scrollY).toEqual(node.offsetHeight - window.innerHeight + offset);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position relative to the current position', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      window.scrollTo(0, 111);

      _animateScroll2.default.scrollMore(10, { duration: duration });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY).toEqual(121);

        _animateScroll2.default.scrollMore(10, { duration: duration });

        // do it again!
        setTimeout(function () {
          (0, _expect2.default)(window.scrollY).toEqual(131);

          done();
        }, waitDuration);
      }, waitDuration);
    });
  });

  it('can take 0 as a duration argument', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollTo(120, { duration: 0 });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY).toEqual(120);
        done();
      }, 1);
    });
  });

  it('can take a function as a duration argument', function (done) {
    (0, _reactDom.render)(tallComponent, node, function () {
      _animateScroll2.default.scrollTo(120, { duration: function duration(v) {
          return v;
        } });

      setTimeout(function () {
        (0, _expect2.default)(window.scrollY).toEqual(0);
      }, 1);
      setTimeout(function () {
        (0, _expect2.default)(window.scrollY).toEqual(120);
        done();
      }, 150);
    });
  });
});