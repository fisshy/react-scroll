"use strict";

var React = require('react');
var assign = require('react/lib/Object.assign');
var Helpers = require('../mixins/Helpers');

var Link = React.createClass({
  mixins: [Helpers.Scroll],
  render: function () {
  	var props = assign({}, this.props, {
      onClick: this.onClick
    });

  	return React.DOM.a(props, this.props.children);
  }
});

module.exports = Link;