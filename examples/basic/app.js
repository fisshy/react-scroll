"use strict";

var React     = require('react');
var ReactDOM  = require('react-dom');
var Scroll    = require('react-scroll'); 

var Link    = Scroll.Link;
var Element = Scroll.Element;
var Events  = Scroll.Events;
var scroll  = Scroll.animateScroll;
var scroller = Scroll.scroller;

var mappedGet = scroller.get;
scroller.get = function(name) {
  return mappedGet(name) || document.getElementById(name);
};

var CustomLink = Scroll.Helpers.Scroll(
  React.createClass({
    render: function () {
      return React.DOM.a(this.props, this.props.children);
    }
  }),
  scroller
);

var Section = React.createClass({
  componentDidMount: function() {

    Events.scrollEvent.register('begin', function() {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function() {
      console.log("end", arguments);
    });

  },
  scrollToTop: function() {
    scroll.scrollToTop();
  },
  componentWillUnmount: function() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
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
                <li><Link activeClass="active" className="test5" to="test5" spy={true} smooth={true} duration={500}>Test 5</Link></li>
                <li><CustomLink className="anchor" to="anchor" spy={true} smooth={true} duration={500}>anchor</CustomLink></li>
              </ul>
            </div>
          </div>
        </nav>

        <Element name="test1" className="element">
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

        <div id="anchor" >
          anthor
        </div>

        <a onClick={this.scrollToTop}>To the top!</a>
      
      </div>
    );
  }
});


ReactDOM.render(
  <Section />,
  document.getElementById('example')
);
