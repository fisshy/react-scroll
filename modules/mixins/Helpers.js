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

// 保存最近一次点击的 link
var clickLink = null;

// 保存 scrollContainer
var scrollSpyContainer = null;

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

        clickLink = this.props.to;

        // TODO 取消之前的事件并停止滚动!

        // 在底部时, 触发 scroll 事件(否则不会切换 activeLink)
        scrollSpyContainer.scrollTop -= 1;

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

      // 判断是否当前滚动条已到底部
      isBottom: function (){
        var contentElements = scrollSpyContainer.children;
        return (scrollSpyContainer.clientHeight + 1) >= contentElements[contentElements.length - 1].getBoundingClientRect().bottom;
      },


      // 判断 link 对应的 element 是否全部可视
      isExposed: function (link){
        if (!link) return false;

        var activeElement = scroller.get(link);
        var cords = activeElement.getBoundingClientRect();
        var topHeight = cords.top;// element 顶部距离 container 的距离
        var bottomHeight = cords.bottom;// element 底部距离 container 的距离

        // 假如顶部低于 container 顶部,而且底部高于 container 底部
        return (Math.floor(topHeight) + 1 >= 0 && Math.floor(bottomHeight) <= scrollSpyContainer.clientHeight);
      },

      componentDidMount: function() {


        scrollSpyContainer = scrollSpyContainer || ( this.props.containerId ? document.getElementById(this.props.containerId) : document );

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

            if(!element || this.props.isDynamic) {
                element = scroller.get(to);
                if(!element){ return;}

                var cords = element.getBoundingClientRect();
                elemTopBound = (cords.top + y);
                elemBottomBound = elemTopBound + cords.height;
            }

            var offsetY = y - this.props.offset;
            var isInside = (offsetY >= Math.floor(elemTopBound) && offsetY <= Math.floor(elemBottomBound));// 判断是否当前元素已接触到上边界(逻辑有问题: 假如是底部的,没法接触上边界,怎么办?)
            var isOutside = (offsetY < Math.floor(elemTopBound) || offsetY > Math.floor(elemBottomBound));
            var activeLink = scroller.getActiveLink();

            // 判断当前 activeLink 是否全部可视
            var isActiveLinkExposed = this.isExposed(clickLink);

            // 假如此时已处于底部, 而且 clickLink 的全部内容都可视, 那么设置 clickLink
            // to 为当前 link 对应的 element
            if (this.isBottom() && isActiveLinkExposed) {
              // 假如命中, 那么设为 active 状态
              if (to === clickLink) {
                scroller.setActiveLink(clickLink);
                this.setState({ active : true });
                scrollSpy.updateStates();

                return true;
              }
            };

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

        // 清除闭包缓存
        clickLink = null;
        scrollSpyContainer = null;
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
