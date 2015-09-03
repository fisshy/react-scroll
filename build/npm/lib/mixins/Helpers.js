"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var animateScroll = require('./animate-scroll');
var scrollSpy = require('./scroll-spy');
var scroller = require('./scroller');

var Helpers = {

  Scroll: {

    propTypes: {
      to: React.PropTypes.string.isRequired,
      offset: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {offset: 0};
    },

    scrollTo : function(to) {
      scroller.scrollTo(to, this.props.smooth, this.props.duration, this.props.offset);
    },

    onClick: function(event) {

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
        var top = 0;
        var height = 0;

        scrollSpy.addStateHandler((function() {
          if(scroller.getActiveLink() != to) {
              this.setState({ active : false });
          }
        }).bind(this));

        scrollSpy.addSpyHandler((function(y) {

          if(!element) {
              element = scroller.get(to);

              var cords = element.getBoundingClientRect();
              top = (cords.top + y);
              height = top + cords.height;
          }

          var offsetY = y - this.props.offset;

          if(offsetY >= top && offsetY <= height && scroller.getActiveLink() != to) {
            scroller.setActiveLink(to);
            this.setState({ active : true });
            if(this.props.onSetActive) this.props.onSetActive(to);
            scrollSpy.updateStates();
          }
        }).bind(this));
      }
    },
    componentWillUnmount: function() {
      scrollSpy.unmount();
    }
  },


  Element: {
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
    componentDidMount: function() {
      scroller.register(this.props.name, ReactDOM.findDOMNode(this));
    },
    componentWillUnmount: function() {
      scroller.unregister(this.props.name);
    }
  }
};

module.exports = Helpers;

