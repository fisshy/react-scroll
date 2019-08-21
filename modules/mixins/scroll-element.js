import React from 'react';
import ReactDOM from 'react-dom';
import scroller from './scroller';
import PropTypes from 'prop-types';


export default (Component) => {
    class Element extends React.Component{

      constructor (props){
        super(props);
        this.childBindings = {
          domNode: null
        };
      }

      componentDidMount() {
        if (typeof window === 'undefined') {
          return false;
        }
        this.registerElems(this.props.name);
      }
      componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
          this.registerElems(this.props.name);
        }
      }
      componentWillUnmount() {
        if (typeof window === 'undefined') {
          return false;
        }
        scroller.unregister(this.props.name);
      }
      registerElems(name) {
        scroller.register(name, this.childBindings.domNode);
      }
      render() {
        return React.createElement(Component, Object.assign({}, this.props, { parentBindings: this.childBindings }));
      }
    };

    Element.propTypes = {
        name: PropTypes.string,
        id:   PropTypes.string
    }

    return Element;
  }