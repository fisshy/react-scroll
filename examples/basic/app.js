"use strict";

var React     = require('react');
var ReactDOM  = require('react-dom');
var Scroll    = require('react-scroll');

var Link       = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

var durationFn = function(deltaTop) {
    return deltaTop;
};

var Section = React.createClass({
  componentDidMount: function() {

    Events.scrollEvent.register('begin', function() {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function() {
      console.log("end", arguments);
    });

    scrollSpy.update();

  },
  scrollToTop: function() {
    scroll.scrollToTop();
  },
  componentWillUnmount: function() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  },
  moveElement8: function(){
    this.moveElement('element-8-spacer');
  },
  moveContainerElement: function(){
    this.moveElement('container-element-spacer');
  },
  moveElement: function(id){
    var element = document.getElementById(id);
    element.style.height = element.style.height === "100px" ? 0 : "100px";
  },
  render: function () {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><Link activeClass="active" className="test1" to="test1" spy={true} smooth={true} duration={500} >Test 1</Link></li>
                <li><Link activeClass="active" className="test2" to="test2" spy={true} smooth={true} duration={500}>Test 2</Link></li>
                <li><Link activeClass="active" className="test3" to="test3" spy={true} smooth={true} duration={500} >Test 3</Link></li>
                <li><Link activeClass="active" className="test4" to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
                <li><Link activeClass="active" className="test5" to="test5" spy={true} smooth={true} duration={500} delay={1000}>Test 5 ( delay )</Link></li>
                <li><Link activeClass="active" className="test6" to="anchor" spy={true} smooth={true} duration={500}>Test 6 (anchor)</Link></li>
                <li><Link activeClass="active" className="test7" to="test7" spy={true} smooth={true} duration={durationFn}>Test 7 (duration and container)</Link></li>
                <li><Link activeClass="active" className="test8" to="test8" spy={true} smooth={true} duration={500} onClick={this.moveElement8} mightMove={true}>Test 8 (moving)</Link></li>
                <li> <a onClick={() => scroll.scrollTo(100)}>Scroll To 100!</a></li>
                <li> <a onClick={() => scroll.scrollToBottom()}>Scroll To Bottom</a></li>
                <li> <a onClick={() => scroll.scrollMore(500)}>Scroll 500 More!</a></li>
                <li> <a onClick={() => scroll.scrollMore(1000, { delay : 1500 })}>Scroll 1000 More! ( delay ) </a></li>
              </ul>
            </div>
          </div>
        </nav>

        <Element name="test1" className="element" >
          test 1
        </Element>

        <Element name="test2" className="element">
          test 2
        </Element>

        <Element name="test3" className="element">
          test 3
        </Element>

        <Element name="test4" className="element">
          test 4
        </Element>

        <Element name="test5" className="element">
          test 5
        </Element>

        <div id="anchor" className="element">
          test 6 (anchor)
        </div>

        <Link activeClass="active" to="firstInsideContainer" spy={true} smooth={true} duration={250} containerId="containerElement" style={{display:'inline-block', margin: '20px'}}>
          Go to first element inside container
        </Link>

        <Link activeClass="active" to="secondInsideContainer" spy={true} smooth={true} duration={250} containerId="containerElement" style={{display:'inline-block', margin: '20px'}}>
          Go to second element inside container
        </Link>
        <Link activeClass="active" to="movingInsideContainer" spy={true} smooth={true} duration={500} containerId="containerElement" onClick={this.moveContainerElement} style={{display:'inline-block', margin: '20px'}} mightMove={true}>
          Go to moving element inside container
        </Link>
        <Element name="test7" className="element" id="containerElement" style={{
          position: 'relative',
          height:'200px',
          overflow:'scroll',
          marginBottom: '100px'
        }}>
          test 7 (duration and container)

          <Element name="firstInsideContainer" style={{
            marginBottom: '200px'
          }}>
            first element inside container
          </Element>

          <Element name="secondInsideContainer" style={{
            marginBottom: '200px'
          }}>
            second element inside container
          </Element>

          <div id="container-element-spacer" style={{transition: 'all 0.5s', height: '100px', background: 'darkorange'}}></div>
          <Element name="movingInsideContainer"  style={{
            marginBottom: '200px'
          }}>
            moving element inside container
          </Element>
        </Element>

        <div id="element-8-spacer" style={{transition: 'all 0.5s', height: '100px', background: 'darkorange'}}></div>
        <Element name="test8" className="element">
          test 8 (moving)
        </Element>

        <a onClick={this.scrollToTop}>To the top!</a>

      </div>
    );
  }
});


ReactDOM.render(
  <Section />,
  document.getElementById('example')
);
