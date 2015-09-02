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
      scroller.scrollTo(to, this.props.smooth, this.props.duration, this.props.offset, this.props.nested);
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

          if (this.props.nested) {
            var parents = findParents(element);
            for (var i = 0; i < parents.length; i++) {
              offsetY += parents[i].scrollTop;
            }
          }
          if(offsetY >= top && offsetY <= height && scroller.getActiveLink() != to) {
            scroller.setActiveLink(to);
            this.setState({ active : true });
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
      var DOM = React.findDOMNode(this);
      var  parents = findParents(DOM);
      //pass in new paramaters: parents
      scrollSpy.nestedScroll(parents);
      scroller.register(this.props.name, DOM, parents);
    },
    componentWillUnmount: function() {
      scroller.unregister(this.props.name);
    }
  }
};

function findParents(element) {
  var parents = [];
  var current = element.parentElement;
  // loop to find all parents that are scrollable
  while(current) {
    if (window.getComputedStyle(current).overflow === 'scroll') {
      parents.push(current);
    }
    current = current.parentElement;
  }
  return parents;
}

module.exports = Helpers;

