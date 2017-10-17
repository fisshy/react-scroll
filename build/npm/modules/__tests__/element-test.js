'use strict';

var _reactDom = require('react-dom');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Element = require('../components/Element.js');

var assert = require('assert');

describe('Element', function () {

  var node = void 0;
  beforeEach(function () {
    node = document.createElement('div');
  });

  afterEach(function () {
    (0, _reactDom.unmountComponentAtNode)(node);
  });

  it('renders only one component', function (done) {

    var component = _react2.default.createElement(
      Element,
      { name: 'test1', className: 'element' },
      'Test 1'
    );

    (0, _reactDom.render)(component, node, function () {
      (0, _expect2.default)(node.textContent).toEqual('Test 1');
      done();
    });
  });

  it('renders two components', function (done) {

    var component = _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        Element,
        { name: 'test1', className: 'element' },
        'A'
      ),
      _react2.default.createElement(
        Element,
        { name: 'test1', className: 'element' },
        'B'
      )
    );

    (0, _reactDom.render)(component, node, function () {
      (0, _expect2.default)(node.textContent).toEqual('AB');
      done();
    });
  });
});