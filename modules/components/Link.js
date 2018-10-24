"use strict";

var React = require('react');
var createReactClass = require('create-react-class');
var Helpers = require('../mixins/Helpers');
var DOM = require('react-dom-factories');

var Link = createReactClass({
  render: function () {
    return DOM.a(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(Link);
