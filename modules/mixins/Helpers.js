"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

const { bool, object, string, func, number } = React.PropTypes

var animateScroll = require('./animate-scroll');
var scrollSpy = require('./scroll-spy');
var scroller = require('./scroller');

var Helpers = {
  
  Scroll: function (Component) {

    return React.createClass({

      propTypes: {
        to: string.isRequired,
        offset: number,
        onClick: func
      },

      getDefaultProps: function() {
        return {offset: 0};
      },

      scrollTo : function(to) {
        scroller.scrollTo(to, this.props.smooth, this.props.duration, this.props.offset);
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

        /*
         * do the magic!
         */

        this.scrollTo(this.props.to);

      },

      componentDidMount: function() {

        scrollSpy.mount();

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

          scrollSpy.addSpyHandler((function(y) {

            if(!element) {
                element = scroller.get(to);

                var cords = element.getBoundingClientRect();
                elemTopBound = (cords.top + y);
                elemBottomBound = elemTopBound + cords.height;
            }

            var offsetY = y - this.props.offset;
            var isInside = (offsetY >= elemTopBound && offsetY <= elemBottomBound);
            var isOutside = (offsetY < elemTopBound || offsetY > elemBottomBound);
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
          }).bind(this));
        }
      },
      componentWillUnmount: function() {
        scrollSpy.unmount();
      },
      render: function() {
        var className = "";
        if(this.state && this.state.active) {
          className = ((this.props.className || "") + " " + (this.props.activeClass || "active")).trim();
        } else {
          className = this.props.className
        }
        return <Component {...this.props} {...this.state} className={className}  onClick={this.handleClick} />;
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
        scroller.register(this.props.name, domNode);
      },
      componentWillUnmount: function() {
        scroller.unregister(this.props.name);
      },
      render: function() {
        return <Component {...this.props} {...this.state} />;
      }
    });
  }
};

module.exports = Helpers;

