"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var animateScroll = require('./animate-scroll');
var scrollSpy = require('./scroll-spy');
var defaultScroller = require('./scroller');
var assign = require('object-assign');


var protoTypes = {
  to: React.PropTypes.string.isRequired,
  containerId: React.PropTypes.string,
  activeClass:React.PropTypes.string,
  spy: React.PropTypes.bool,
  smooth: React.PropTypes.bool,
  offset: React.PropTypes.number,
  delay: React.PropTypes.number,
  isDynamic: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  duration: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
  defaultActive: React.PropTypes.bool
};

var hasScroll = false;

var Helpers = {

  Scroll: function (Component, customScroller) {

    var scroller = customScroller || defaultScroller;

    return React.createClass({

      propTypes: protoTypes,

      getDefaultProps: function() {
        return {offset: 0};
      },

      scrollTo : function(to, props) {
          scroller.scrollTo(to, props);
      },

      handleClick: function(event) {
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

        // change the active Link at first(do not depend on the element's scroll)
        var self = this;
        scroller.setActiveLink(void 0);
        this.setState({
          active : false
        }, function () {
          scrollSpy.updateStates();
          hasScroll = true;

          scroller.setActiveLink(this.props.to);
          self.setState({
            active : true
          }, function () {
            scrollSpy.updateStates()
          });

          if(self.props.onSetActive) {
            self.props.onSetActive(self.props.to);
          }
        });

        /*
         * do the magic!
         */
        this.scrollTo(this.props.to, this.props);

      },

      spyHandler: function(y) {
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

        } else if (isInside && activeLink != to) {
          scroller.setActiveLink(to);
          this.setState({ active : true });

          if(this.props.onSetActive) {
            this.props.onSetActive(to);
          }

          scrollSpy.updateStates();
        }
      },

      componentDidMount: function() {

        var containerId = this.props.containerId;

        var scrollSpyContainer = containerId ? document.getElementById(containerId) : document;

        scrollSpy.mount(scrollSpyContainer);


        if(this.props.spy) {
          var to = this.props.to;
          var element = null;
          var elemTopBound = 0;
          var elemBottomBound = 0;

          scrollSpy.addStateHandler((function() {
            if(scroller.getActiveLink() != to) {
                this.setState({ active : false });
            }
          }).bind(this));

          var spyHandler = function(y) {

            if (hasScroll) return true;

            if(!element || this.props.isDynamic) {
                element = scroller.get(to);
                if(!element){ return;}

                var cords = element.getBoundingClientRect();
                elemTopBound = (cords.top + y);
                elemBottomBound = elemTopBound + cords.height;
            }

            var offsetY = y - this.props.offset;
            var isInside = (offsetY >= Math.floor(elemTopBound) && offsetY <= Math.floor(elemBottomBound));
            var isOutside = (offsetY < Math.floor(elemTopBound) || offsetY > Math.floor(elemBottomBound));
            var activeLink = scroller.getActiveLink();

            if (isOutside && activeLink === to) {
              scroller.setActiveLink(void 0);
              this.setState({ active : false });

            } else if (isInside && activeLink != to) {
              scroller.setActiveLink(to);
              this.setState({ active : true });

              if(this.props.onSetActive) {
                this.props.onSetActive(to);
              }

              scrollSpy.updateStates();

            }
          }.bind(this);

          scrollSpy.addSpyHandler(spyHandler);
        }

        // initial active
        if (this.props.defaultActive) {
          scroller.setActiveLink(this.props.to);
          this.setState({
            active : true
          }, function (){
            scrollSpy.updateStates();
          });

          if(this.props.onSetActive) {
            this.props.onSetActive(this.props.to);
          }
        }
      },
      componentWillUnmount: function() {
        scrollSpy.unmount();
        animateScroll.resetContainer();
      },
      render: function() {

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
    });
  },


  Element: function(Component) {
    return React.createClass({
      propTypes: {
        name: React.PropTypes.string.isRequired
      },
      componentDidMount: function() {
        var domNode = ReactDOM.findDOMNode(this);
        defaultScroller.register(this.props.name, domNode);
      },
      componentWillUnmount: function() {
        defaultScroller.unregister(this.props.name);
        animateScroll.resetContainer();
      },
      render: function() {
        return React.createElement(Component, this.props);
      }
    });
  }
};

module.exports = Helpers;
