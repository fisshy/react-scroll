"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Button extends React.Component{
  render() {
    return React.DOM.input(this.props, this.props.children);
  }
};

module.exports = Helpers.Scroll(Button);
