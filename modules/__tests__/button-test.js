import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Simulate } from "react-dom/test-utils";
import expect from "expect";
import Button from "../components/Button";
import Element from "../components/Element";

describe("Button", function () {
  let node = null;

  beforeEach(function () {
    node = document.createElement("div");
    document.body.appendChild(node);
  });

  afterEach(function () {
    unmountComponentAtNode(node);
    node.remove();
    node = null;
  });

  it("renders Button with correct text", function (done) {
    const buttonText = 'Click me';
    const component = <Button to="test1" spy={true} smooth={true} duration={500}>{buttonText}</Button>;

    render(component, node, function () {
      expect(node.textContent).toEqual('Click me');
      done();
    });
  });

  it("renders Button with children component", function (done) {
    const component = (
      <Button to="test1" spy={true} smooth={true} duration={500}>
        <div>Children</div>
      </Button>
    );

    render(component, node, function () {
      const divElem = node.querySelector("div");
      expect(divElem.textContent).toEqual('Children');
      done();
    });
  });

  it("scrolls to matching Element and adds 'active' class to Button if spy is true", function (done) {
    const component = (
      <div>
        <ul>
          <li>
            <Button to="test3" spy={true}>Test 3</Button>
          </li>
        </ul>
        <Element name="test1" className="element" style={{ width: "100vw", height: "100vh" }}>
          test1
        </Element>
        <Element name="test2" className="element" style={{ width: "100vw", height: "100vh" }}>
          test2
        </Element>
        <Element name="test3" className="element" style={{ width: "100vw", height: "100vh" }}>
          test3
        </Element>
      </div>
    );

    render(component, node, function () {
      const buttonElem = node.querySelector("button");

      Simulate.click(buttonElem);

      setTimeout(() => {
        expect(buttonElem.classList.contains("active")).toBe(true);
        done();
      }, 500);
    });
  });
});
