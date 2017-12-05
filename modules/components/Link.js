"use strict";

import React from 'react';
import ScrollLink from '../mixins/scroll-link';

class LinkElement extends React.Component {
  render = () => (<a {...this.props}>{this.props.children}</a>)
};

export default ScrollLink(LinkElement)
