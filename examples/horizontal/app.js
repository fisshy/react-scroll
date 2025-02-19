import React from "react";
import * as ReactDOM from "react-dom/client";
import Scroll    from 'react-scroll';

import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll,
  scrollSpy,
  scroller
} from "react-scroll";

const durationFn = function (deltaTop) {
  return deltaTop;
};

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", function () {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register("end", function () {
      console.log("end", arguments);
    });
  }
  scrollToTop() {
    scroll.scrollToTop();
  }
  scrollTo(offset) {
    scroller.scrollTo("scroll-to-element", {
      horizontal: true,
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: offset
    });
  }
  scrollToWithContainer() {
    let goToContainer = new Promise((resolve, reject) => {
      Events.scrollEvent.register("end", () => {
        resolve();
        Events.scrollEvent.remove("end");
      });

      scroller.scrollTo("scroll-container", {
        horizontal: true,
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart"
      });
    });

    goToContainer.then(() =>
      scroller.scrollTo("scroll-container-second-element", {
        horizontal: true,
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        containerId: "scroll-container",
        offset: 50
      })
    );
  }
  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }
  render() {
    return (
      <div className="pageContainer">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <ul className="nav navbar-nav">
                <li>
                  <Link
                    activeClass="active"
                    className="test1"
                    to="test1"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                    offset={50}
                  >
                    Test 1
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test2"
                    to="test2"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                    offset={-55}
                  >
                    Test 2
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test3"
                    to="test3"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                  >
                    Test 3
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test4"
                    to="test4"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                  >
                    Test 4
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test5"
                    to="test5"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                    delay={1000}
                  >
                    Test 5 ( delay )
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test6"
                    to="anchor"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={500}
                  >
                    Test 6 (anchor)
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test7"
                    to="test7"
                    spy={true}
                    horizontal
                    smooth={true}
                    duration={durationFn}
                  >
                    Test 7 (duration and container)
                  </Link>
                </li>
                <li>
                  {" "}
                  <a onClick={() => animateScroll.scrollTo(100, { horizontal: true })}>
                    Scroll To 100!
                  </a>
                </li>
                <li>
                  {" "}
                  <a onClick={() => animateScroll.scrollToBottom({ horizontal: true })}>
                    Scroll To Bottom
                  </a>
                </li>
                <li>
                  {" "}
                  <a onClick={() => animateScroll.scrollMore(500, { horizontal: true })}>
                    Scroll 500 More!
                  </a>
                </li>
                <li>
                  {" "}
                  <a
                    onClick={() =>
                      animateScroll.scrollMore(1000, { delay: 1500, horizontal: true })
                    }
                  >
                    Scroll 1000 More! ( delay ){" "}
                  </a>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test8"
                    to="same"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Same target
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    className="test9"
                    to="same"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Same target
                  </Link>
                </li>
                <li>
                  <a
                    className="test1"
                    to="test1"
                    onClick={() => this.scrollTo()}
                  >
                    Scroll to element
                  </a>
                </li>
                <li>
                  <a
                    className="test1"
                    to="test1"
                    onClick={() => this.scrollTo(-50)}
                  >
                    Scroll to element (offset -50)
                  </a>
                </li>
                <li>
                  <a
                    className="test1"
                    to="test1"
                    onClick={() => this.scrollToWithContainer()}
                  >
                    Scroll to element within container
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div>
          <Element name="test1" className="element">
            test 1
          </Element>
        </div>

        <Element name="test2" className="element no-padding">
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

        <Link
          activeClass="active"
          to="firstInsideContainer"
          spy={true}
          horizontal
          smooth={true}
          duration={250}
          containerId="containerElement"
          style={{ display: "inline-block", margin: "20px" }}
        >
          Go to first element inside container
        </Link>

        <Link
          activeClass="active"
          to="secondInsideContainer"
          spy={true}
          horizontal
          smooth={true}
          duration={250}
          containerId="containerElement"
          style={{ display: "inline-block", margin: "20px" }}
        >
          Go to second element inside container
        </Link>

        <Element
          name="test7"
          className="element"
          id="containerElement"
          style={{
            position: "relative",
            width: "200px",
            overflow: "scroll",
            marginBottom: "100px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
          }}
        >
          <Element
            name="firstInsideContainer"
            style={{
              marginRight: "200px"
            }}
          >
            first element inside container
          </Element>

          <Element
            name="secondInsideContainer"
            style={{
              marginRight: "200px"
            }}
          >
            second element inside container
          </Element>
        </Element>

        <Element id="same" className="element">
          Two links point to this
        </Element>

        <Element name="scroll-to-element" className="element">
          Scroll to element
        </Element>

        <div
          className="element"
          id="scroll-container"
          style={{
            width: "200px",
            overflow: "scroll",
            marginRight: "100px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
          }}
        >
          <form>
            <Element
              name="scroll-container-first-element"
              style={{
                marginRight: "200px"
              }}
            >
              first element inside container
            </Element>

            <div
              id="scroll-container-second-element"
              style={{
                marginRight: "200px"
              }}
            >
              second element inside container
            </div>
          </form>
        </div>

        <a onClick={() => { this.scrollToTop({ horizontal: true }) }}>To the Left!</a>
      </div>
    );
  }
}


ReactDOM.createRoot(document.getElementById("example")).render(
  <React.StrictMode>
    <Section />
  </React.StrictMode>
);

