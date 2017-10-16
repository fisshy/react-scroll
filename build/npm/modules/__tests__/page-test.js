'use strict';

var _reactDom = require('react-dom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Element = require('../components/Element.js');

var _Element2 = _interopRequireDefault(_Element);

var _Link = require('../components/Link.js');

var _Link2 = _interopRequireDefault(_Link);

var _scrollEvents = require('../mixins/scroll-events.js');

var _scrollEvents2 = _interopRequireDefault(_scrollEvents);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Test */
/* React */
describe('Page', function () {

  var node = document.createElement('div');

  document.body.appendChild(node);

  var scrollDuration = 10;

  var lastDivStyle = { height: "2000px" };

  // todo there is fail in "is active when clicked" when name="test3" (same as in events-test.js)
  var component = _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'ul',
      null,
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'test1', spy: true, smooth: true, duration: scrollDuration },
          'Test 1'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'test2', spy: true, smooth: true, duration: scrollDuration },
          'Test 2'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'test30', spy: true, smooth: true, duration: scrollDuration },
          'Test 3'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'test4', spy: true, smooth: true, duration: scrollDuration },
          'Test 4'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'test5', spy: true, smooth: true, duration: scrollDuration },
          'Test 5'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _Link2.default,
          { to: 'anchor', spy: true, smooth: true, duration: scrollDuration },
          'Test 6'
        )
      )
    ),
    _react2.default.createElement(
      _Element2.default,
      { name: 'test1', className: 'element' },
      'test 1'
    ),
    _react2.default.createElement(
      _Element2.default,
      { name: 'test2', className: 'element' },
      'test 2'
    ),
    _react2.default.createElement(
      _Element2.default,
      { name: 'test30', className: 'element' },
      'test 3'
    ),
    _react2.default.createElement(
      _Element2.default,
      { name: 'test4', className: 'element' },
      'test 4'
    ),
    _react2.default.createElement(
      _Element2.default,
      { name: 'test5', className: 'element' },
      'test 5'
    ),
    _react2.default.createElement(
      'div',
      { id: 'anchor', className: 'element', style: lastDivStyle },
      'test 6'
    )
  );

  beforeEach(function () {
    (0, _reactDom.unmountComponentAtNode)(node);
  });

  afterEach(function () {
    window.scrollTo(0, 0);
    _scrollEvents2.default.scrollEvent.remove('begin');
    _scrollEvents2.default.scrollEvent.remove('end');
  });

  it('renders six elements of link/element', function (done) {

    (0, _reactDom.render)(component, node, function () {

      var allLinks = node.querySelectorAll('a');
      var allTargets = node.querySelectorAll('.element');

      (0, _expect2.default)(allLinks.length).toEqual(6);
      (0, _expect2.default)(allTargets.length).toEqual(6);

      done();
    });
  });

  it('it is at top in start', function (done) {
    (0, _expect2.default)(window.scrollY).toEqual(0);
    done();
  });

  it('is active when clicked', function (done) {

    (0, _reactDom.render)(component, node, function () {

      var link = node.querySelectorAll('a')[2];

      var target = node.querySelectorAll('.element')[2];

      var expectedScrollTo = target.getBoundingClientRect().top;

      _reactAddonsTestUtils2.default.Simulate.click(link);

      var scrollStart = window.scrollY;

      /* Let it scroll, duration is based on param sent to Link */

      setTimeout(function () {

        var scrollStop = scrollStart + expectedScrollTo;

        (0, _expect2.default)(window.scrollY).toEqual(scrollStop);

        (0, _expect2.default)(link.className).toEqual('active');

        done();
      }, scrollDuration + 500);
    });
  });

  it('is active when clicked to last (5) element', function (done) {

    (0, _reactDom.render)(component, node, function () {

      var link = node.querySelectorAll('a')[5];

      var target = node.querySelectorAll('.element')[5];

      var expectedScrollTo = target.getBoundingClientRect().top;

      _reactAddonsTestUtils2.default.Simulate.click(link);

      /* Let it scroll, duration is based on param sent to Link */
      var scrollStart = window.scrollY;

      setTimeout(function () {

        var scrollStop = scrollStart + expectedScrollTo;

        (0, _expect2.default)(window.scrollY).toEqual(scrollStop);

        (0, _expect2.default)(link.className).toEqual('active');

        done();
      }, scrollDuration + 500);
    });
  });
});
/* Components to test */