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
      //check if the parentId was added as a prop to element (optional)
      if (this.props.parentId){
        //use react getDomNode and offsetTop to get relative position from top of parent div
        var relativePosition = this.getDOMNode().offsetTop;
        var parent = document.getElementById(this.props.parentId);
      } 
      //pass in new paramaters: parent and relativePosition
      scroller.register(this.props.name, this.getDOMNode(), parent, relativePosition);
    },
    componentWillUnmount: function() {
      scroller.unregister(this.props.name);
    }
  }
};

module.exports = Helpers;

