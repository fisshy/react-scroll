"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

var Link = React.createClass({
  render: function () {
    return React.DOM.a(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(Link);
