const React = require('react');
const ReactDOM = require('react-dom');
const scroller = require('./scroller');
const PropTypes = require('prop-types');


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
      componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name) {
          this.registerElems(nextProps.name);
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