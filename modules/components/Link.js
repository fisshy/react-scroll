"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Link extends React.Component{
  render() {
    return (
      <a {...this.props}>
        {this.props.children}
      </a>
    );
  }
};

module.exports = Helpers.Scroll(Link);
