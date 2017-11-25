"use strict";

import React from 'react';
import ScrollElement from '../mixins/scroll-element';
const PropTypes = require('prop-types');

class Element extends React.Component{
  render() {
    // Remove `parentBindings` from props
    let newProps = Object.assign({}, this.props);
    if (newProps.parentBindings) {
      delete newProps.parentBindings;
    }

    return (
      <div {...newProps} ref={(el) => { this.props.parentBindings.domNode = el; }}>
        {this.props.children}
      </div>
    );
  }
};

Element.propTypes = {
  name: PropTypes.string,
  id:   PropTypes.string
}

export default ScrollElement(Element);
