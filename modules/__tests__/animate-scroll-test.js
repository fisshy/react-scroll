import { render, unmountComponentAtNode } from 'react-dom'
import Rtu from 'react-dom/test-utils'
import React from 'react'

import expect from 'expect'
import animateScroll from '../mixins/animate-scroll';
import events from '../mixins/scroll-events.js';

var currentPositionY = function () {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
    document.documentElement.scrollTop : document.body.scrollTop;
};

describe('AnimateScroll', () => {

  let node;
  let node2;
  const duration = 10;
  const waitDuration = duration * 10;

  let tallComponent =
    <div id="hugeComponent">
      <a onClick={() => animateScroll.scrollToTop()}>Scroll To Top!</a>
      <a onClick={() => animateScroll.scrollTo(100)}>Scroll To 100!</a>
      <a onClick={() => animateScroll.scrollMore(10)}>Scroll More!</a>
      <div style={{ height: '10000px' }}></div>
    </div>

  let tallComponent2 =
    <div id="hugeComponent2">
      <a onClick={() => animateScroll.scrollToTop()}>Scroll To Top!</a>
      <a onClick={() => animateScroll.scrollTo(100)}>Scroll To 100!</a>
      <a onClick={() => animateScroll.scrollMore(10)}>Scroll More!</a>
      <div style={{ height: '10000px' }}></div>
    </div>

  beforeEach(() => {
    node = document.createElement('div');
    node2 = document.createElement('div');
    document.body.appendChild(node);
    document.body.appendChild(node2);
  })

  afterEach(function () {
    window.scrollTo(0, 0);
    node.style.cssText = "";
    node2.style.cssText = "";
    document.body.style.cssText = "";

    unmountComponentAtNode(node);
    unmountComponentAtNode(node2);
    document.body.removeChild(node);
    document.body.removeChild(node2);
    document.body.innerHtml = "";
  });

  it('renders a component taller than the window height', () => {
    render(tallComponent, node, () => {
      expect(node.offsetHeight > window.innerHeight).toBe(true);
    });
  });

  it('scrolls to an absolute position', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(120, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position given a node as a container ', (done) => {
    render(tallComponent, node, () => {

      window.scrollTo(0, 0);
      node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
      document.body.style.cssText = "overflow: hidden;";

      animateScroll.scrollTo(400, { duration: duration, container: node });
      setTimeout(() => {
        expect(node.scrollTop).toEqual(400);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to an absolute position even if current position is higher', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(200, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(200);

        done();
      }, waitDuration);

    });
  });

  it('scrolls to top', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollToTop({ duration: duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollToBottom({ duration: duration });

      setTimeout(() => {
        var offset = 16;
        expect(window.scrollY).toEqual(node.offsetHeight - window.innerHeight + offset);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position relative to the current position', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 111);

      animateScroll.scrollMore(10, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(121);

        animateScroll.scrollMore(10, { duration: duration });

        // do it again!
        setTimeout(() => {
          expect(window.scrollY).toEqual(131);

          done();
        }, waitDuration);

      }, waitDuration);
    });
  });

  it('can take 0 as a duration argument', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollTo(120, { duration: 0 });

      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, 100);
    });
  });

  it('can take a function as a duration argument', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollTo(120, { duration: (v) => v });
      expect(window.scrollY).toEqual(0);

      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, 150);
    });
  });

  it('can scroll two DIVs', (done) => {
    render(tallComponent, node, () => {
      render(tallComponent2, node2, () => {
        window.scrollTo(0, 0);
        node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        node2.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        document.body.style.cssText = "overflow: hidden;";

        animateScroll.scrollTo(300, { duration: duration, container: node });
        animateScroll.scrollTo(400, { duration: duration, container: node2 });
        setTimeout(() => {
          expect(node.scrollTop).toEqual(300);
          expect(node2.scrollTop).toEqual(400);
          done();
        }, waitDuration);
      });
    });
  });

});
