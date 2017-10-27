/* React */
import { render, unmountComponentAtNode, findDOMNode } from 'react-dom'
import Rtu      from 'react-dom/test-utils'
import React    from 'react'
import expect   from 'expect'
import assert   from 'assert';
import scroll from '../mixins/animate-scroll.js';

describe('scroll cancellation', () => {
  let node = document.createElement('div');
  document.body.innerHtml = "";

  document.body.appendChild(node)

  beforeEach(function () {
    unmountComponentAtNode(node);
    window.scrollTo(0,0);
  });

  describe("when scrolling is triggered by keydown handlers", () => {
    it("can scroll on keydown multiple times in a row", async () => {
      const duration = 100;
      const distance = 100;

      class TestComponent extends React.Component {
        handleKeyDown = () => {
          scroll.scrollMore(distance, { smooth: true, duration });
        }
        render () {
          return (
            <div>
              <input onKeyDown={this.handleKeyDown} />
              <div style={{height: "3000px", width: "100%", background: "repeating-linear-gradient(to bottom, white, black 100px)"}}/>
            </div>
          );
        }
      }

      render(<TestComponent/>, node);

      dispatchDOMKeydownEvent(13, node.querySelector('input'));
      await wait(duration*2);
      expect(window.scrollY).toBeGreaterThanOrEqualTo(distance);

      dispatchDOMKeydownEvent(13, node.querySelector('input'));
      await wait(duration*2);
      expect(window.scrollY).toBeGreaterThanOrEqualTo(distance * 2);

      dispatchDOMKeydownEvent(13, node.querySelector('input'));
      await wait(duration*2);
      expect(window.scrollY).toBeGreaterThanOrEqualTo(distance * 3);
    });
  });
});

function wait(ms) {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  })
}

function dispatchDOMKeydownEvent(keyCode, element) {
  const event = document.createEvent("KeyboardEvent");
  const initMethod = typeof event.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
  event[initMethod]("keydown", true, true, window, 0, 0, 0, 0, 0, keyCode);
  element.dispatchEvent(event);
}
