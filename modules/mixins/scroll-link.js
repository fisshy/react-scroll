import React from 'react';

import scrollSpy from './scroll-spy';
import defaultScroller from './scroller';
import PropTypes from 'prop-types';
import scrollHash from './scroll-hash';

const protoTypes = {
  to: PropTypes.string.isRequired,
  containerId: PropTypes.string,
  container: PropTypes.object,
  activeClass: PropTypes.string,
  activeStyle: PropTypes.object,
  spy: PropTypes.bool,
  horizontal: PropTypes.bool,
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
  hashSpy: PropTypes.bool,
  saveHashHistory: PropTypes.bool,
  spyThrottle: PropTypes.number
};

export default (Component, customScroller) => {

  const scroller = customScroller || defaultScroller;

  class Link extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        active: false
      };
      this.beforeUnmountCallbacks = [];
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

    spyHandler = (x, y) => {
      let scrollSpyContainer = this.getScrollSpyContainer();

      if (scrollHash.isMounted() && !scrollHash.isInitialized()) {
        return;
      }

      const {horizontal} = this.props;
      let to = this.props.to;
      let element = null;
      let isInside;
      let isOutside;

      if (horizontal) {
        let elemLeftBound = 0;
        let elemRightBound = 0;
        let containerLeft = 0;

        if (scrollSpyContainer.getBoundingClientRect) {
          let containerCords = scrollSpyContainer.getBoundingClientRect();
          containerLeft = containerCords.left;
        }

        if (!element || this.props.isDynamic) {
          element = scroller.get(to);
          if (!element) { return; }

          let cords = element.getBoundingClientRect();
          elemLeftBound = (cords.left - containerLeft + x);
          elemRightBound = elemLeftBound + cords.width;
        }

        let offsetX = x - this.props.offset;
        isInside = (offsetX >= Math.floor(elemLeftBound) && offsetX < Math.floor(elemRightBound));
        isOutside = (offsetX < Math.floor(elemLeftBound) || offsetX >= Math.floor(elemRightBound));
      } else {
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
        isInside = (offsetY >= Math.floor(elemTopBound) && offsetY < Math.floor(elemBottomBound));
        isOutside = (offsetY < Math.floor(elemTopBound) || offsetY >= Math.floor(elemBottomBound));
      }

      let activeLink = scroller.getActiveLink();

      if (isOutside) {
        if (to === activeLink) {
          scroller.setActiveLink(void 0);
        }

        if (this.props.hashSpy && scrollHash.getHash() === to) {
          const { saveHashHistory = false } = this.props
          scrollHash.changeHash("", saveHashHistory);
        }

        if (this.props.spy && this.state.active) {
          this.setState({ active: false });
          element.classList.remove(this.getActiveClassName());
          this.props.onSetInactive && this.props.onSetInactive(to, element);
        }

      }

      if (isInside && (activeLink !== to || this.state.active === false)) {
        scroller.setActiveLink(to);
        const { saveHashHistory = false } = this.props
        this.props.hashSpy && scrollHash.changeHash(to, saveHashHistory);

        if (this.props.spy) {
          this.setState({ active: true });
          element.classList.add(this.getActiveClassName());
          this.props.onSetActive && this.props.onSetActive(to, element);
        }
      }
    }

    getScrollSpyContainer() {
      let containerId = this.props.containerId;
      let container = this.props.container;

      if (containerId && !container) {
        return document.getElementById(containerId);
      }

      if (container && container.nodeType) {
        return container;
      }

      return document;
    }

    getActiveClassName() {
      return this.props.activeClass || "active";
    }

    componentDidMount() {
      if (this.props.spy || this.props.hashSpy) {
        let scrollSpyContainer = this.getScrollSpyContainer();

        if (!scrollSpy.isMounted(scrollSpyContainer)) {
          const fn = scrollSpy.mount(scrollSpyContainer, this.props.spyThrottle);
          this.beforeUnmountCallbacks.push(fn);
        }

        if (this.props.hashSpy) {
          if (!scrollHash.isMounted()) {
            scrollHash.mount(scroller);
          }
          scrollHash.mapContainer(this.props.to, scrollSpyContainer);
        }

        scrollSpy.addSpyHandler(this.spyHandler, scrollSpyContainer);

        this.setState({
          container: scrollSpyContainer
        });

      }
    }
    componentWillUnmount() {
      scrollSpy.unmount(this.stateHandler, this.spyHandler);
      this.beforeUnmountCallbacks.forEach(fn => fn());
    }
    render() {
      var className = "";

      if (this.state && this.state.active) {
        className = ((this.props.className || "") + " " + (this.props.activeClass || "active")).trim();
      } else {
        className = this.props.className;
      }

      var style = {};

      if (this.state && this.state.active) {
        style = Object.assign({}, this.props.style, this.props.activeStyle);
      } else {
        style = Object.assign({}, this.props.style);
      }

      let props = Object.assign({}, this.props);

      for (var prop in protoTypes) {
        if (props.hasOwnProperty(prop)) {
          delete props[prop];
        }
      }

      props.className = className;
      props.style = style;
      props.onClick = this.handleClick;

      return React.createElement(Component, props);
    }
  };

  Link.propTypes = protoTypes;

  Link.defaultProps = { offset: 0 };

  return Link;
}
