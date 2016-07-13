"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

var Element = React.createClass({
  render: function () {
    return React.DOM.div(this.props, this.props.children);
  }
});

module.exports = Helpers.Element(Element);
