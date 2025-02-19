import React from "react";
import * as ReactDOM from "react-dom/client";
import Scroll    from 'react-scroll';

var Link       = Scroll.Link;
var Element    = Scroll.Element;

class Section extends React.Component{
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

ReactDOM.createRoot(document.getElementById("example")).render(
  <React.StrictMode>
    <Section />
  </React.StrictMode>
);

document.body.addEventListener("scroll", () => {

  console.log("scroll event outside ")

});
