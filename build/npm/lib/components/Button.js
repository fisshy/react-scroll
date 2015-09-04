"use strict";

var React = require('react');
var assign = require('react/lib/Object.assign');
var Helpers = require('../mixins/Helpers');

var Button = React.createClass({
  mixins: [Helpers.Scroll],
  getInitialState : function() {
    return { active : false};
  },
  render: function () {
    var props = assign({}, this.props, {
      onClick: this.onClick
    });

    return React.DOM.input(props, this.props.children);
  }
});

module.exports = Button;
