import React  from 'react';
import ReactDOM from 'react-dom';

import utils from'./utils';
import scrollSpy from'./scroll-spy';
import defaultScroller from'./scroller';
import PropTypes from'prop-types';
import scrollHash from'./scroll-hash';

const protoTypes = {
  to: PropTypes.string.isRequired,
  containerId: PropTypes.string,
  container: PropTypes.object,
  activeClass: PropTypes.string,
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

export default (Component, customScroller) => {

  const scroller = customScroller || defaultScroller;

  class Link extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        active: false
      };
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

    spyHandler = (y) => {

      let scrollSpyContainer = this.getScrollSpyContainer();

      if (scrollHash.isMounted() && !scrollHash.isInitialized()) {
        return;
      }

      let to = this.props.to;
      let element = null;
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
      let isInside = (offsetY >= Math.floor(elemTopBound) && offsetY < Math.floor(elemBottomBound));
      let isOutside = (offsetY < Math.floor(elemTopBound) || offsetY >= Math.floor(elemBottomBound));
      let activeLink = scroller.getActiveLink();

      if (isOutside) {
        if (to === activeLink) {
          scroller.setActiveLink(void 0);
        }

        if (this.props.hashSpy && scrollHash.getHash() === to) {
          scrollHash.changeHash();
        }

        if (this.props.spy && this.state.active) {
          this.setState({ active: false });
          this.props.onSetInactive && this.props.onSetInactive(to, element);
        }

      }

      if (isInside && (activeLink !== to || this.state.active === false)) {
        scroller.setActiveLink(to);

        this.props.hashSpy && scrollHash.changeHash(to);

        if (this.props.spy) {
          this.setState({ active: true });
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

    componentDidMount() {
      if (this.props.spy || this.props.hashSpy) {
        let scrollSpyContainer = this.getScrollSpyContainer();

        if (!scrollSpy.isMounted(scrollSpyContainer)) {
          scrollSpy.mount(scrollSpyContainer);
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
    }
    render() {
      var className = "";

      if (this.state && this.state.active) {
        className = ((this.props.className || "") + " " + (this.props.activeClass || "active")).trim();
      } else {
        className = this.props.className;
      }

      let props = Object.assign({}, this.props);

      for (var prop in protoTypes) {
        if (props.hasOwnProperty(prop)) {
          delete props[prop];
        }
      }

      props.className = className;
      props.onClick = this.handleClick;

      return React.createElement(Component, props);
    }
  };

  Link.propTypes = protoTypes;

  Link.defaultProps = { offset: 0 };

  return Link;
}
