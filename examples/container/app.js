"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Scroll = require('react-scroll');

var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

var durationFn = function (deltaTop) {
  return deltaTop;
};

class Section extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <ul className="nav navbar-nav">
            <li><Link activeClass="active" to="first" spy={true} smooth={true} duration={250} containerId="containerElement">1st element</Link></li>
            <li><Link activeClass="active" to="second" spy={true} smooth={true} duration={250} containerId="containerElement">2nd element</Link></li>
            <li><Link activeClass="active" to="nestedContainer" spy={true} smooth={true} duration={250} containerId="containerElement">nested container element</Link></li>
            <li><Link activeClass="active" to="fourth" spy={true} smooth={true} duration={250} containerId="containerElement">4th element</Link></li>
            <li><Link activeClass="active" to="relativeContainer" spy={true} smooth={true} duration={250} containerId="containerElement">nested relative container element</Link></li>
          </ul>
        </nav>

        <Element name="container" className="element" id="containerElement">
          <Element name="first" className="element">first element inside container</Element>
          <Element name="second" className="element">second element inside container</Element>

          <nav className="navbar navbar-default">
            <ul className="nav navbar-nav">
              <li><Link activeClass="active" to="first-nested" spy={true} smooth={true} duration={250} containerId="nestedContainerElement">1st element</Link></li>
              <li><Link activeClass="active" to="second-nested" spy={true} smooth={true} duration={250} containerId="nestedContainerElement">2nd element</Link></li>
              <li><Link activeClass="active" to="third-nested" spy={true} smooth={true} duration={250} containerId="nestedContainerElement">3rd element</Link></li>
              <li><Link activeClass="active" to="fourth-nested" spy={true} smooth={true} duration={250} containerId="nestedContainerElement">4th element</Link></li>
            </ul>
          </nav>

          <Element name="nestedContainer" className="element fixed-size" id="nestedContainerElement">
            <Element name="first-nested" className="element">first element inside container</Element>
            <Element name="second-nested" className="element">second element inside container</Element>
            <Element name="third-nested" className="element">third element inside container</Element>
            <Element name="fourth-nested" className="element">fourth element inside container</Element>
          </Element>


          <Element name="fourth" className="element">fourth element inside container</Element>

          <nav className="navbar navbar-default">
            <ul className="nav navbar-nav">
              <li><Link activeClass="active" to="first-relative" spy={true} smooth={true} duration={250} containerId="nestedRelativeContainerElement">1st element</Link></li>
              <li><Link activeClass="active" to="second-relative" spy={true} smooth={true} duration={250} containerId="nestedRelativeContainerElement">2nd element</Link></li>
              <li><Link activeClass="active" to="third-relative" spy={true} smooth={true} duration={250} containerId="nestedRelativeContainerElement">3rd element</Link></li>
              <li><Link activeClass="active" to="fourth-relative" spy={true} smooth={true} duration={250} containerId="nestedRelativeContainerElement">4th element</Link></li>
            </ul>
          </nav>

          <Element name="relativeContainer" className="element fixed-size" id="nestedRelativeContainerElement">
            <Element name="first-relative" className="element relative fixed-size">first element inside container</Element>
            <Element name="second-relative" className="element relative fixed-size">second element inside container</Element>
            <Element name="third-relative" className="element relative fixed-size">third element inside container</Element>
            <Element name="fourth-relative" className="element relative fixed-size">fourth element inside container</Element>
          </Element>

        </Element>
      </div>
    );
  }
};


ReactDOM.render(
  <Section />,
  document.getElementById('example')
);
