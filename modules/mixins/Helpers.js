"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var utils = require('./utils');
var scrollSpy = require('./scroll-spy');
var defaultScroller = require('./scroller');
var assign = require('object-assign');
var PropTypes = require('prop-types');

var scrollHash = require('./scroll-hash');


var protoTypes = {
  to: PropTypes.string.isRequired,
  containerId: PropTypes.string,
  container: PropTypes.object,
  activeClass:PropTypes.string,
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

var Helpers = {
  Scroll: function (Component, customScroller) {

    var scroller = customScroller || defaultScroller;

    class _ extends React.Component{
      constructor(props){
        super(props);
        this.scrollTo = this.scrollTo.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.stateHandler = this.stateHandler.bind(this);
        this.spyHandler = this.spyHandler.bind(this);

        this.state = {
          active: false
        };
      }

      scrollTo(to, props) {
        scroller.scrollTo(to, Object.assign({}, this.state, props));
      }

      handleClick(event) {

        /*
         * give the posibility to override onClick
         */

        if(this.props.onClick) {
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


      stateHandler() {
        var to = this.props.to;

        if(scroller.getActiveLink() !== to) {
          if(this.state !== null && this.state.active && this.props.onSetInactive) {
            this.props.onSetInactive();
          }
          this.setState({ active : false });
        }
      }

      spyHandler(y) {
        var scrollSpyContainer = this.getScrollSpyContainer();

        if (scrollHash.isMounted() && !scrollHash.isInitialized()) {
          return;
        }

        var to = this.props.to;

        var element = null;
        var elemTopBound = 0;
        var elemBottomBound = 0;

        var containerTop = 0;
        if(scrollSpyContainer.getBoundingClientRect) {
          var containerCords = scrollSpyContainer.getBoundingClientRect();
          containerTop = containerCords.top;
        }

        if(!element || this.props.isDynamic) {
          element = scroller.get(to);
          if(!element){ return;}

          var cords = element.getBoundingClientRect();
          elemTopBound = (cords.top - containerTop + y);
          elemBottomBound = elemTopBound + cords.height;
        }

        var offsetY = y - this.props.offset;
        // var isInside = (offsetY >= Math.floor(elemTopBound) && offsetY <= Math.floor(elemBottomBound));
        // var isOutside = (offsetY < Math.floor(elemTopBound) || offsetY > Math.floor(elemBottomBound));
        var isInside = (offsetY >= Math.floor(elemTopBound) && offsetY < Math.floor(elemBottomBound));
        var isOutside = (offsetY < Math.floor(elemTopBound) || offsetY >= Math.floor(elemBottomBound));
        var activeLink = scroller.getActiveLink();

        if (isOutside) {
          if (to === activeLink) {
            scroller.setActiveLink(void 0);
          }

          if (this.props.hashSpy && scrollHash.getHash() === to) {
            scrollHash.changeHash();
          }

          if (this.props.spy && this.state.active) {
            this.setState({ active : false });

            if(this.props.onSetInactive) {
              this.props.onSetInactive();
            }
          }
        } else if (isInside && activeLink !== to) {
          scroller.setActiveLink(to);

          if (this.props.hashSpy) {
            scrollHash.changeHash(to);
          }

          if (this.props.spy) {
            this.setState({ active : true });
            if(this.props.onSetActive) {
              this.props.onSetActive(to);
            }
          }

          scrollSpy.updateStates();
        }
      }

      getScrollSpyContainer() {
        var containerId = this.props.containerId;
        var container = this.props.container;

        var scrollSpyContainer;

        if(containerId) {
          scrollSpyContainer = document.getElementById(containerId);
        } else if (container && container.nodeType) {
          scrollSpyContainer = container;
        } else {
          scrollSpyContainer = utils.getScrollParent(ReactDOM.findDOMNode(this));
        }

        return scrollSpyContainer;
      }

      componentDidMount() {
        if(this.props.spy || this.props.hashSpy) {
          var scrollSpyContainer = this.getScrollSpyContainer();

          if(!scrollSpy.isMounted(scrollSpyContainer)) {
            scrollSpy.mount(scrollSpyContainer);
          }

          if (this.props.hashSpy) {
            if(!scrollHash.isMounted()) {
              scrollHash.mount(scroller);
            }
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

        if(this.state && this.state.active) {
          className = ((this.props.className || "") + " " + (this.props.activeClass || "active")).trim();
        } else {
          className = this.props.className;
        }

        var props = assign({}, this.props);

        for(var prop in protoTypes) {
          if(props.hasOwnProperty(prop)) {
            delete props[prop];
          }
        }

        props.className = className;
        props.onClick = this.handleClick;

        return React.createElement(Component, props);
      }
    };
    _.propTypes = protoTypes;
    _.defaultProps={offset: 0};
    return _;
  },


  Element: function(Component) {
    class _ extends React.Component{

      constructor (props){
        super(props);
        this.registerElems = this.registerElems.bind(this);
        this.childBindings = {
          domNode: null
        };
      }

      componentDidMount() {
        this.registerElems(this.props.name);
      }
      componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name) {
          this.registerElems(nextProps.name);
        }
      }
      componentWillUnmount() {
        defaultScroller.unregister(this.props.name);
      }
      registerElems(name) {
        defaultScroller.register(name, this.childBindings.domNode);
      }
      render() {
        return React.createElement(Component, Object.assign({}, this.props, { parentBindings: this.childBindings }));
      }
    };
    _.propTypes = {
        name: PropTypes.string,
        id:   PropTypes.string
    }
    return _;
  }
};

module.exports = Helpers;
