"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

class Element extends React.Component{
  render() {
    return (
      <div {...this.props} ref={(el) => { this.props.parentBindings.domNode = el; }}>
        {this.props.children}
      </div>
    );
  }
};

module.exports = Helpers.Element(Element);
