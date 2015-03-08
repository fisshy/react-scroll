"use strict";

var React = require('react');
var assign = require('react/lib/Object.assign');
var Helpers = require('../mixins/Helpers');

var Link = React.createClass({
  mixins: [Helpers.Scroll, Helpers.Spy],
  getInitialState : function() {
  	return { active : false};
  },
  render: function () {

  	var props = assign({}, this.props, {
      onClick: this.onClick,
      className : this.state.active ? "active" : ""
    });

  	return React.DOM.a(props, this.props.children);
  }
});

module.exports = Link;