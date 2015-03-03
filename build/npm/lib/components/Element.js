"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');

var Element = React.createClass({
  mixins: [Helpers.Element],
  render: function () {
    /*
     * Not sure if should allow more then one property?
     */

    var className = this.props.className || "";
    
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Element;