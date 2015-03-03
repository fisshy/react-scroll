"use strict";

var React = require('react');
var Scroll = require('react-scroll'); 

var Link = Scroll.Link;
var Element = Scroll.Element;

var Section = React.createClass({
  render: function () {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><Link to="test1" smooth={true}>Test 1</Link></li>
                <li><Link to="test2" smooth={true}>Test 2</Link></li>
                <li><Link to="test3" smooth={true}>Test 3</Link></li>
                <li><Link to="test4" smooth={true}>Test 4</Link></li>
                <li><Link to="test5" smooth={true}>Test 5</Link></li>
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
      </div>
    );
  }
});


React.render(
  <Section />,
  document.getElementById('example')
);