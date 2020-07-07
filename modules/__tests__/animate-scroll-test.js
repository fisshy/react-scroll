import { render, unmountComponentAtNode } from 'react-dom'
import Rtu from 'react-dom/test-utils'
import React from 'react'

import expect from 'expect'
import animateScroll from '../mixins/animate-scroll';
import events from '../mixins/scroll-events.js';

import { renderHorizontal } from './utility'

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

  let wideComponent =
    <div id="wideComponent">
      <a onClick={() => animateScroll.scrollToTop({ horizontal: true })}>Scroll To Top!</a>
      <a onClick={() => animateScroll.scrollTo(100, { horizontal: true })}>Scroll To 100!</a>
      <a onClick={() => animateScroll.scrollMore(10, { horizontal: true })}>Scroll More!</a>
      <div style={{ width: '10000px', height: '100px', display: 'inline-block' }}></div>
    </div>

  let wideComponent2 =
    <div id="wideComponent2">
      <a onClick={() => animateScroll.scrollToTop({ horizontal: true })}>Scroll To Top!</a>
      <a onClick={() => animateScroll.scrollTo(100, { horizontal: true })}>Scroll To 100!</a>
      <a onClick={() => animateScroll.scrollMore(10, { horizontal: true })}>Scroll More!</a>
      <div style={{ width: '10000px', height: '100px', display: 'inline-block' }}></div>
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

  it('renders a component wider than the window width', () => {
    renderHorizontal(wideComponent, node, () => {
      expect(node.offsetWidth > window.innerWidth).toBe(true);
    });
  });

  it('scrolls to an absolute position vertically', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(120, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to an absolute position horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      window.scrollTo(1000, 0);
      animateScroll.scrollTo(120, { duration: duration, horizontal: true });

      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(120);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position given a node as a container vertically', (done) => {
    render(tallComponent, node, () => {

      window.scrollTo(0, 0);
      node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
      document.body.style.cssText += "; overflow: hidden;";

      animateScroll.scrollTo(400, { duration: duration, container: node });
      setTimeout(() => {
        expect(node.scrollTop).toEqual(400);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position given a node as a container horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {

      window.scrollTo(0, 0);
      node.style.cssText = "position: fixed; left: 0; right: 200px; height 100%; overflow: scroll";

      animateScroll.scrollTo(400, { duration: duration, container: node, horizontal: true });
      setTimeout(() => {
        expect(node.scrollLeft).toEqual(400);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to an absolute position even if current position is higher vertically', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(200, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(200);

        done();
      }, waitDuration);

    });
  });

  it('scrolls to an absolute position even if current position is farther horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      window.scrollTo(1000, 0);
      animateScroll.scrollTo(200, { duration: duration, horizontal: true });

      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(200);

        done();
      }, waitDuration);

    });
  });

  it('scrolls to top', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollToTop({ duration: duration });

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to top horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      window.scrollTo(1000, 0);
      animateScroll.scrollToTop({ duration: duration, horizontal: true });

      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollToBottom({ duration: duration });
      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(document.documentElement.scrollTop);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      animateScroll.scrollToBottom({ duration: duration, horizontal: true });
      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(document.documentElement.scrollLeft);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to a position relative to the current position vertically', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 111);

      animateScroll.scrollMore(10, { duration: duration });

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(121);

        animateScroll.scrollMore(10, { duration: duration });

        // do it again!
        setTimeout(() => {
          expect(window.scrollY || window.pageYOffset).toEqual(131);

          done();
        }, waitDuration);

      }, waitDuration);
    });
  });

  it('scrolls to a position relative to the current position horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      window.scrollTo(111, 0);

      animateScroll.scrollMore(10, { duration: duration, horizontal: true });

      setTimeout(() => {
        expect(window.scrollYX || window.pageXOffset).toEqual(121);

        animateScroll.scrollMore(10, { duration: duration, horizontal: true });

        // do it again!
        setTimeout(() => {
          expect(window.scrollX || window.pageXOffset).toEqual(131);

          done();
        }, waitDuration);

      }, waitDuration);
    });
  });

  it('can take 0 as a duration argument vertically', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollTo(120, { duration: 0 });

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, 100);
    });
  });

  it('can take 0 as a duration argument horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      animateScroll.scrollTo(120, { duration: 0, horizontal: true });

      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(120);
        done();
      }, 100);
    });
  });

  it('can take a function as a duration argument vertically', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollTo(120, { duration: (v) => v });
      expect(window.scrollY || window.pageYOffset).toEqual(0);

      setTimeout(() => {
        expect(window.scrollY || window.pageYOffset).toEqual(120);
        done();
      }, 150);
    });
  });

  it('can take a function as a duration argument horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      animateScroll.scrollTo(120, { duration: (v) => v, horizontal: true });
      expect(window.scrollX || window.pageXOffset).toEqual(0);

      setTimeout(() => {
        expect(window.scrollX || window.pageXOffset).toEqual(120);
        done();
      }, 150);
    });
  });

  it('can scroll two DIVs vertically', (done) => {
    render(tallComponent, node, () => {
      render(tallComponent2, node2, () => {
        window.scrollTo(0, 0);
        node.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        node2.style.cssText = "position: fixed; top: 0; bottom: 200px; width 100%; overflow: scroll";
        document.body.style.cssText += "; overflow: hidden;";

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

  it('can scroll two DIVs horizontally', (done) => {
    renderHorizontal(wideComponent, node, () => {
      renderHorizontal(wideComponent2, node2, () => {
        window.scrollTo(0, 0);
        node.style.cssText = "position: fixed; left: 0; right: 200px; height 100%; overflow: scroll";
        node2.style.cssText = "position: fixed; left: 0; right: 200px; height 100%; overflow: scroll";
        document.body.style.cssText += "; overflow: hidden;";

        animateScroll.scrollTo(300, { duration: duration, container: node, horizontal: true });
        animateScroll.scrollTo(400, { duration: duration, container: node2, horizontal: true });
        setTimeout(() => {
          expect(node.scrollLeft).toEqual(300);
          expect(node2.scrollLeft).toEqual(400);
          done();
        }, waitDuration);
      });
    });
  });

});
