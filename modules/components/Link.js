"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Link extends React.Component{
  render() {
    return React.DOM.a(this.props, this.props.children);
  }
};

module.exports = Helpers.Scroll(Link);
