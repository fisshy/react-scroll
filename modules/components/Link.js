"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

var Link = React.createClass({
  mixins: [Helpers.Scroll],
  render: function () {
    return (
      <a onClick={this.onClick} href="test">
        {this.props.children}
      </a>
    );
  }
});

module.exports = Link;