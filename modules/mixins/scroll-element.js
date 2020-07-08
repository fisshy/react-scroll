import React from 'react';
import ReactDOM from 'react-dom';
import scroller from './scroller';
import PropTypes from 'prop-types';


export default (Component) => {
  function Element(props) {
    const childBindings = React.useRef({ domNode: null });
    React.useEffect(() => {
      scroller.register(props.name, childBindings.current.domNode);
      return () => scroller.unregister(props.name);
    }, [props.name]);

    return React.createElement(Component, Object.assign({}, props, { parentBindings: childBindings.current }));
  }

  Element.propTypes = {
    name: PropTypes.string,
    id:   PropTypes.string,
  };

  return Element;
}
