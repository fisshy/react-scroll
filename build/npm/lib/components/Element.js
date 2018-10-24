"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');
var DOM = require('react-dom-factories');

var Element = React.createClass({
  render: function () {
    return DOM.div(this.props, this.props.children);
  }
});

module.exports = Helpers.Element(Element);
