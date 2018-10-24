"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');
var createReactClass = require('create-react-class');
var DOM = require('react-dom-factories');

var Element = createReactClass({
  render: function () {
    return DOM.div(this.props, this.props.children);
  }
});

module.exports = Helpers.Element(Element);
