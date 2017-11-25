"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

import ScrollLink from '../mixins/scroll-link';

class LinkElement extends React.Component {
  render = () => (<a {...this.props}>{this.props.children}</a>)
};

export default ScrollLink(LinkElement);
