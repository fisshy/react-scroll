"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

var Button = React.createClass({
  render: function () {
    return React.DOM.input(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(Button);
