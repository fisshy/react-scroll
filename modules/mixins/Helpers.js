"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var animateScroll = require('./animate-scroll');
var scrollSpy = require('./scroll-spy');
var defaultScroller = require('./scroller');
var assign = require('object-assign');
var PropTypes = require('prop-types');


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
  ignoreCancelEvents: PropTypes.bool
};

var Helpers = {

  Scroll: function (Component, customScroller) {

    var scroller = customScroller || defaultScroller;

    class _ extends React.Component{

      constructor(props){
        super(props);
        this.scrollTo = this.scrollTo.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.spyHandler = this.spyHandler.bind(this);

      }

      scrollTo(to, props) {
          scroller.scrollTo(to, props);
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

      spyHandler(y) {
        var element = scroller.get(this.props.to);
        if (!element) return;
        var cords = element.getBoundingClientRect();
        var topBound = cords.top + y;
        var bottomBound = topBound + cords.height;
        var offsetY = y - this.props.offset;
        var to = this.props.to;
        var isInside = (offsetY >= topBound && offsetY <= bottomBound);
        var isOutside = (offsetY < topBound || offsetY > bottomBound);
        var activeLink = scroller.getActiveLink();

        if (isOutside && activeLink === to) {
          scroller.setActiveLink(void 0);
          this.setState({ active : false });

          if(this.props.onSetInactive) {
            this.props.onSetInactive();
          }

        } else if (isInside && activeLink != to) {
          scroller.setActiveLink(to);
          this.setState({ active : true });

          if(this.props.onSetActive) {
            this.props.onSetActive(to);
          }

          scrollSpy.updateStates();
        }
      }

      componentDidMount() {

        var containerId = this.props.containerId;
        var container = this.props.container;

        var scrollSpyContainer;

        if(containerId) {
          scrollSpyContainer = document.getElementById(containerId);
        } else if (container && container.nodeType) {
          scrollSpyContainer = container;
        } else {
          scrollSpyContainer = document;
        }


        if(!scrollSpy.isMounted(scrollSpyContainer)) {
          scrollSpy.mount(scrollSpyContainer);
        }


        if(this.props.spy) {
          var to = this.props.to;
          var element = null;
          var elemTopBound = 0;
          var elemBottomBound = 0;

          this._stateHandler = function() {
            if(scroller.getActiveLink() != to) {
                if(this.state !== null && this.state.active && this.props.onSetInactive) {
                  this.props.onSetInactive();
                }
                this.setState({ active : false });
            }
          }.bind(this)

          scrollSpy.addStateHandler(this._stateHandler);

          this._spyHandler = function(y) {

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
            var isInside = (offsetY >= Math.floor(elemTopBound) && offsetY <= Math.floor(elemBottomBound));
            var isOutside = (offsetY < Math.floor(elemTopBound) || offsetY > Math.floor(elemBottomBound));
            var activeLink = scroller.getActiveLink();

            if (isOutside && activeLink === to) {
              scroller.setActiveLink(void 0);
              this.setState({ active : false });

              if(this.props.onSetInactive) {
                this.props.onSetInactive();
              }

            } else if (isInside && activeLink != to) {
              scroller.setActiveLink(to);
              this.setState({ active : true });

              if(this.props.onSetActive) {
                this.props.onSetActive(to);
              }

              scrollSpy.updateStates();

            }
          }.bind(this);

          scrollSpy.addSpyHandler(this._spyHandler, scrollSpyContainer);
        }
      }
      componentWillUnmount() {
        scrollSpy.unmount(this._stateHandler, this._spyHandler);
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
