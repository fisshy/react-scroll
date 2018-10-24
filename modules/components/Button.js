"use strict";

var React = require('react');
var createReactClass = require('create-react-class');
var DOM = require('react-dom-factories');

var Helpers = require('../mixins/Helpers');

var Button = createReactClass({
  render: function () {
    return DOM.input(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(Button);
