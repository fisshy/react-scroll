"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Button extends React.Component{
  render() {
    return (
      <input {...this.props}>
        {this.props.children}
      </input>
    );
  }
};

module.exports = Helpers.Scroll(Button);
