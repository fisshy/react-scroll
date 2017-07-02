"use strict";

var React = require('react');
var Helpers = require('../mixins/Helpers');
var PropTypes = require('prop-types');

class Element extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      children,
      tagName = 'DIV',
      parentBindings,
      ...rest
    } = this.props;

    const passedProps = {
      ...rest,
      ref: (el) => { parentBindings.domNode = el; }
    };

    return (React.createElement(tagName, passedProps, children));
  }
};

Element.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  tagName: (props, propName, componentName) => {
    const obsoleteTags = ['BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];
    const selfClosingTags = [
      'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
      'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
    ];

    if (typeof props[propName] !== 'string') {
      return new TypeError(
        `Prop ${propName} in ${componentName} of type ${typeof props[propName]}. Expected string.`
      );
    }

    if (selfClosingTags.concat(obsoleteTags).includes(props[propName].toUpperCase())) {
      return new Error(
        `Prop ${propName} passed to the ${componentName} component may not be a self-closing HTML tagName.`
      );
    }
  },
};

Element.defaultProps = {
  tagName: 'DIV',
};

module.exports = Helpers.Element(Element);
