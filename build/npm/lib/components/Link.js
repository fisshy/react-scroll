"use strict";

var React = require('react');
var assign = require('react/lib/Object.assign');
var Helpers = require('../mixins/Helpers');

var Link = React.createClass({
  mixins: [Helpers.Scroll],
  getInitialState : function() {
    return { active : false};
  },
  getDefaultProps: function() {
    return {
      className: ""
    };
  },
  render: function () {

    var activeClass = this.state.active ? (this.props.activeClass || "active") : "";

    var props = assign({}, this.props, {
      onClick: this.onClick,
      className : [this.props.className, activeClass].join(" ").trim()
    });

    return React.DOM.a(props, this.props.children);
  }
});

module.exports = Link;
