"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');
var directScroller = require('../mixins/direct-scroller');

var DirectLink = React.createClass({
  render: function () {
    return React.DOM.a(this.props, this.props.children);
  }
});

module.exports = Helpers.Scroll(DirectLink, directScroller);
