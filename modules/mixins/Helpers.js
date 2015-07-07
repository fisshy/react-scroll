"use strict";

var React = require('react');
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
      if(this.props.spy) {
        var to = this.props.to;
        var element = null;
        var top = 0;
        var height = 0;
        var self = this;

        scrollSpy.addStateHandler(function() {
          if(scroller.getActiveLink() != to) {
              self.setState({ active : false });
          }
        });

        scrollSpy.addSpyHandler(function(y) {

          if(!element) {
              element = scroller.get(to);
              var cords = element.getBoundingClientRect();
              top = (cords.top + y);
              height = top + cords.height;
          }

          var offsetY = y - self.props.offset;

          if(offsetY >= top && offsetY <= height && scroller.getActiveLink() != to) {

            scroller.setActiveLink(to);

            self.setState({ active : true });

            scrollSpy.updateStates();
          }
        });
      }
    }
  },

  componentWillUnmount: function(){
    scrollSpy.unmount();
  },

  Element: {
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
    componentDidMount: function() {
      var dom = this.getDOMNode();
      // start relative position as initial dom offsetTop
      var relativePosition = dom.offsetTop;
      var parent = parentMatcher(dom, function(parent){
        var bool = window.getComputedStyle(parent).overflow === 'scroll';
        if (!bool) relativePosition += parent.offsetTop;
        return bool;
      });
      //pass in new paramaters: parent and relativePosition
      scroller.register(this.props.name, dom, parent, relativePosition);
    },
    componentWillUnmount: function() {
      scroller.unregister(this.props.name);
    }
  }
};

function parentMatcher(elem, matcher){
  // Recursive call method
  // var parent = elem.parentElement;
  // if (!parent || matcher(parent)){
  //   return parent;
  // }
  // return parentMatcher(parent, matcher);
  var parent = elem.parentElement;
  while(parent && !matcher(parent)){
    parent = parent.parentElement;
  }
  return parent;
};

module.exports = Helpers;

