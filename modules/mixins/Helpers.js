"use strict";

/* DEPRECATED */

const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('./utils');
const scrollSpy = require('./scroll-spy');
const defaultScroller = require('./scroller');
const PropTypes = require('prop-types');
const scrollHash = require('./scroll-hash');

const protoTypes = {
  to: PropTypes.string.isRequired,
  containerId: PropTypes.string,
  container: PropTypes.object,
  activeClass: PropTypes.string,
  spy: PropTypes.bool,
  smooth: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  offset: PropTypes.number,
  delay: PropTypes.number,
  isDynamic: PropTypes.bool,
  onClick: PropTypes.func,
  duration: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  absolute: PropTypes.bool,
  onSetActive: PropTypes.func,
  onSetInactive: PropTypes.func,
  ignoreCancelEvents: PropTypes.bool,
  hashSpy: PropTypes.bool
};

const Helpers = {
  Scroll(Component, customScroller) {

    console.warn("Helpers.Scroll is deprecated since v1.7.0");

    const scroller = customScroller || defaultScroller;

    class Scroll extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          active: false
        };
      }

      scrollTo = (to, props) => {
        scroller.scrollTo(to, Object.assign({}, this.state, props));
      }

      handleClick = (event) => {

        /*
         * give the posibility to override onClick
         */

        if (this.props.onClick) {
          this.props.onClick(event);
        }

        /*
         * dont bubble the navigation
         */

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();

        /*
         * do the magic!
         */
        this.scrollTo(this.props.to, this.props);

      }


      stateHandler = () => {
        if (scroller.getActiveLink() !== this.props.to) {
          if (this.state !== null && this.state.active && this.props.onSetInactive) {
            this.props.onSetInactive();
          }
          this.setState({ active: false });
        }
      }

      spyHandler = (y) => {

        let scrollSpyContainer = this.getScrollSpyContainer();

        if (scrollHash.isMounted() && !scrollHash.isInitialized()) {
          return;
        }

        let to = this.props.to;
        let element = null;
        let elemTopBound = 0;
        let elemBottomBound = 0;
        let containerTop = 0;

        if (scrollSpyContainer.getBoundingClientRect) {
          let containerCords = scrollSpyContainer.getBoundingClientRect();
          containerTop = containerCords.top;
        }

        if (!element || this.props.isDynamic) {
          element = scroller.get(to);
          if (!element) { return; }

          let cords = element.getBoundingClientRect();
          elemTopBound = (cords.top - containerTop + y);
          elemBottomBound = elemTopBound + cords.height;
        }

        let offsetY = y - this.props.offset;
        let isInside = (offsetY >= Math.floor(elemTopBound) && offsetY < Math.floor(elemBottomBound));
        let isOutside = (offsetY < Math.floor(elemTopBound) || offsetY >= Math.floor(elemBottomBound));
        let activeLink = scroller.getActiveLink();

        if (isOutside) {
          if (to === activeLink) {
            scroller.setActiveLink(void 0);
          }

          if (this.props.hashSpy && scrollHash.getHash() === to) {
            scrollHash.changeHash();
          }

          if (this.props.spy && this.state.active) {
            this.setState({ active: false });
            this.props.onSetInactive && this.props.onSetInactive();
          }

          return scrollSpy.updateStates();
        }

        if (isInside && activeLink !== to) {
          scroller.setActiveLink(to);

          this.props.hashSpy && scrollHash.changeHash(to);

          if (this.props.spy) {
            this.setState({ active: true });
            this.props.onSetActive && this.props.onSetActive(to);
          }
          return scrollSpy.updateStates();
        }
      }

      getScrollSpyContainer() {
        let containerId = this.props.containerId;
        let container = this.props.container;

        if (containerId) {
          return document.getElementById(containerId);
        }

        if (container && container.nodeType) {
          return container;
        }

        return document;
      }

      componentDidMount() {
        if (this.props.spy || this.props.hashSpy) {
          let scrollSpyContainer = this.getScrollSpyContainer();

          if (!scrollSpy.isMounted(scrollSpyContainer)) {
            scrollSpy.mount(scrollSpyContainer);
          }

          if (this.props.hashSpy) {
            if (!scrollHash.isMounted()) {
              scrollHash.mount(scroller);
            }
            scrollHash.mapContainer(this.props.to, scrollSpyContainer);
          }

          if (this.props.spy) {
            scrollSpy.addStateHandler(this.stateHandler);
          }

          scrollSpy.addSpyHandler(this.spyHandler, scrollSpyContainer);

          this.setState({
            container: scrollSpyContainer
          });

        }
      }
      componentWillUnmount() {
        scrollSpy.unmount(this.stateHandler, this.spyHandler);
      }
      render() {
        var className = "";

        if (this.state && this.state.active) {
          className = ((this.props.className || "") + " " + (this.props.activeClass || "active")).trim();
        } else {
          className = this.props.className;
        }

        var props = Object.assign({}, this.props);

        for (var prop in protoTypes) {
          if (props.hasOwnProperty(prop)) {
            delete props[prop];
          }
        }

        props.className = className;
        props.onClick = this.handleClick;

        return React.createElement(Component, props);
      }
    };

    Scroll.propTypes = protoTypes;

    Scroll.defaultProps = { offset: 0 };

    return Scroll;
  },

  Element(Component) {

    console.warn("Helpers.Element is deprecated since v1.7.0");

    class Element extends React.Component {

      constructor(props) {
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
        defaultScroller.unregister(this.props.name);
      }
      registerElems(name) {
        defaultScroller.register(name, this.childBindings.domNode);
      }
      render() {
        return React.createElement(Component, Object.assign({}, this.props, { parentBindings: this.childBindings }));
      }
    };

    Element.propTypes = {
      name: PropTypes.string,
      id: PropTypes.string
    }

    return Element;
  }
};

module.exports = Helpers;
