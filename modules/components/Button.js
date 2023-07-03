"use strict";

import React from 'react';
import ScrollLink from '../mixins/scroll-link';

class ButtonElement extends React.Component{
  render() {
    return (
      <button {...this.props}>
        {this.props.children}
      </button>
    );
  }
};

export default ScrollLink(ButtonElement);
