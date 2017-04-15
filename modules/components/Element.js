"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Element extends React.Component{
  render() {
    return React.DOM.div(this.props, this.props.children);
  }
};

module.exports = Helpers.Element(Element);
