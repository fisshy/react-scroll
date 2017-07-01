"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

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

module.exports = Helpers.Element(Element);
