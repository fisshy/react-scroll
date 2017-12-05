"use strict";

import React from 'react';
import ScrollLink from '../mixins/scroll-link';

class ButtonElement extends React.Component{
  render() {
    return (
      <input {...this.props}>
        {this.props.children}
      </input>
    );
  }
};

export default ScrollLink(ButtonElement);
