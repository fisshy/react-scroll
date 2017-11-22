import React, { Component } from 'react';
import { render } from 'react-dom';
import { Element, scrollSpy, Events, Link } from 'react-scroll';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <h1>test </h1>
        <div className="nav">
            <Link to="test1" spy={true} smooth={true} duration={500} offset={-50}>
              Test 1
            </Link>
            <Link to="test2" spy={true} smooth={true} duration={500} offset={-50}>
              Test 2
            </Link>
            <Link to="test3" spy={true} smooth={true} duration={500} offset={-50}>
              Test 3
            </Link>
        </div>

        <Element name="test1" className="fake-height">
          <div className="">test 1 </div>
        </Element>
        <Element name="test2" className="fake-height">
          <div className="">test 2 </div>
        </Element>

        <Element name="test3" className="fake-height">
          <div className="">test 3 </div>
        </Element>
        
      </div>
    );
  }
}

render(<App />, document.getElementById('example'));

document.body.addEventListener("scroll", () => {

  console.log("scroll event outside ")

});
