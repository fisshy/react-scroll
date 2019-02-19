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
        this.registerElems(this.props.name);
      }
      componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
          this.registerElems(this.props.name);
        }
      }
      componentWillUnmount() {
        if (typeof window !== 'undefined') {
          scroller.unregister(this.props.name);
        }
      }
      registerElems(name) {
        if (typeof window !== 'undefined') {
          scroller.register(name, this.childBindings.domNode);
        }
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