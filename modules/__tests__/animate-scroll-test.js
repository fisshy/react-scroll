import {render, unmountComponentAtNode} from 'react-dom'
import Rtu      from 'react-addons-test-utils'
import React    from 'react'

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

  let node = document.createElement('div');

  document.body.innerHtml = "";

  document.body.appendChild(node);

  const duration = 10;

  // the bigger the difference between the 2 the better,
  // For some reason, sometimes test just fail because the animation did complete in time!
  const waitDuration = duration * 10;

  let tallComponent =
      <div id="hugeComponent">
        <a onClick={() => animateScroll.scrollToTop()}>Scroll To Top!</a>
        <a onClick={() => animateScroll.scrollTo(100)}>Scroll To 100!</a>
        <a onClick={() => animateScroll.scrollMore(10)}>Scroll More!</a>
        <div style={{height: '10000px'}}></div>
      </div>

  afterEach(function () {
    window.scrollTo(0, 0);

    unmountComponentAtNode(node);
  });

  it('renders a component taller than the window height', () => {
    render(tallComponent, node, () => {
      expect(node.offsetHeight > window.innerHeight).toBe(true);
    });
  });

  it('scrolls to an absolute position', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(120, { duration : duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to an absolute position even if current position is higher', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollTo(200, { duration : duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(200);

        done();
      }, waitDuration);

    });
  });

  it('scrolls to top', (done) => {
    render(tallComponent, node, () => {
      window.scrollTo(0, 1000);
      animateScroll.scrollToTop({ duration : duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(0);
        done();
      }, waitDuration);
    });
  });

  it('scrolls to bottom', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollToBottom({ duration : duration });

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

      animateScroll.scrollMore(10, { duration : duration });

      setTimeout(() => {
        expect(window.scrollY).toEqual(121);

        animateScroll.scrollMore(10, { duration : duration });

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
      animateScroll.scrollTo(120, { duration : 0 });

      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, 1);
    });
  });

  it('can take a function as a duration argument', (done) => {
    render(tallComponent, node, () => {
      animateScroll.scrollTo(120, {duration: (v) => v});

      setTimeout(() => {
        expect(window.scrollY).toEqual(0);
      }, 1);
      setTimeout(() => {
        expect(window.scrollY).toEqual(120);
        done();
      }, 150);
    });
  })
});
