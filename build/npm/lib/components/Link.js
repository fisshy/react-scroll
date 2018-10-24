"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');
var DOM = require ('react-dom-factories');

var Link = React.createClass({
  render: function () {
    return DOM.a(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(Link);
