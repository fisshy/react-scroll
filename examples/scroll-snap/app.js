"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Scroll = require('react-scroll'); 

var Link = Scroll.Link;
var Element = Scroll.Element;
var ScrollSnapMixin = Scroll.ScrollSnapMixin;

var Section = React.createClass({
  getInitialState() {
    return {
      overflow: true
    }
  },

  mixins: [ScrollSnapMixin],

  handleClick: function () {
    if (this.state.overflow) {
      document.body.style.overflowY = 'hidden';
      this.setState({ overflow: false });
    } else {
      document.body.style.overflowY = 'scroll';
      this.setState({ overflow: true });
    }
  },

  render: function () {
    var overflow;

    if (this.state.overflow) {
      overflow = 'With';
    } else {
      overflow = 'Without';
    }

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><Link to="test1" spy={true} smooth={true} duration={500} >Test 1</Link></li>
                <li><Link to="test2" spy={true} smooth={true} duration={500}>Test 2</Link></li>
                <li><Link to="test3" spy={true} smooth={true} duration={500} >Test 3</Link></li>
                <li><Link to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
                <li><Link to="test5" spy={true} smooth={true} duration={500}>Test 5</Link></li>
                <li><a onClick={ this.handleClick }>{overflow} "overflow: hidden"</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <Element name="test1" className="element" style={{ backgroundColor: '#ffffff' }}>
          test 1
        </Element>

        <Element name="test2" className="element" style={{ backgroundColor: '#008000' }}>
          test 2
        </Element>

        <Element name="test3" className="element" style={{ backgroundColor: '#00C0C0' }}>
          test 3
        </Element>

        <Element name="test4" className="element" style={{ backgroundColor: '#C0C0FF' }}>
          test 4
        </Element>

        <Element name="test5" className="element" style={{ backgroundColor: '#FFC0FF' }}>
          test 5
        </Element>
      </div>
    );
  }
});


ReactDOM.render(
  <Section />,
  document.getElementById('example')
);