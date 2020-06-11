/* React */
import { render, unmountComponentAtNode } from 'react-dom'
import Rtu from 'react-dom/test-utils'
import React from 'react'
/* Components to test */
import Element from '../components/Element.js';
import Link from '../components/Link.js';
import events from '../mixins/scroll-events.js';
/* Test */
import expect from 'expect';
import assert from 'assert';
import sinon from 'sinon';
import { renderHorizontal } from './utility.js';

const wait = (ms, cb) => {
  setTimeout(cb, ms);
}

describe('Page', () => {

  let node;
  let scrollDuration = 10;

  const component = (horizontal) => {
    const style = (() => {
      if (horizontal) {
        return {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        }
      } else {
        return undefined
      }
    })()

    const lastDivStyle = (() => {
      if (horizontal) {
        return {
          width: "2000px"
        }
      } else {
        return {
          height: "2000px"
        }
      }
    })()

    return (
      <div style={{ style }}>
        <ul>
          <li><Link to="test1" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 1</Link></li>
          <li><Link to="test2" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 2</Link></li>
          <li><Link to="test3" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 3</Link></li>
          <li><Link to="test4" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 4</Link></li>
          <li><Link to="test5" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 5</Link></li>
          <li><Link to="test6" spy={true} smooth={true} duration={scrollDuration} horizontal={horizontal}>Test 6</Link></li>
        </ul>
        <Element name="test1" className="element">test 1</Element>
        <Element name="test2" className="element">test 2</Element>
        <Element name="test3" className="element">test 3</Element>
        <Element name="test4" className="element">test 4</Element>
        <Element name="test5" className="element">test 5</Element>
        <div id="test6" className="element" style={lastDivStyle}>test 6</div>
      </div>
    )
  }

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node)

  });

  afterEach(function () {
    window.scrollTo(0, 0);
    events.scrollEvent.remove('begin');
    events.scrollEvent.remove('end');
    unmountComponentAtNode(node)
    document.body.removeChild(node);
  });

  it('renders six elements of link/element', (done) => {

    render(component(false), node, () => {

      var allLinks = node.querySelectorAll('a');
      var allTargets = node.querySelectorAll('.element');

      expect(allLinks.length).toEqual(6);
      expect(allTargets.length).toEqual(6);

      done();

    });

  })

  it('it is at top left in start', (done) => {
    expect(window.scrollX || window.pageXOffset).toEqual(0);
    expect(window.scrollY || window.pageYOffset).toEqual(0);
    done();
  });

  it('is active when clicked vertically', (done) => {

    render(component(false), node, () => {

      var link = node.querySelectorAll('a')[2];

      var target = node.querySelectorAll('.element')[2];

      var expectedScrollTo = target.getBoundingClientRect().top;

      Rtu.Simulate.click(link);

      var scrollStart = window.scrollY || window.pageYOffset;

      /* Let it scroll, duration is based on param sent to Link */

      setTimeout(() => {

        var scrollStop = Math.round(scrollStart + expectedScrollTo)

        expect(window.scrollY || window.pageYOffset).toEqual(scrollStop);

        expect(link.className).toEqual('active');

        done();

      }, scrollDuration + 500);

    });

  })

  it('is active when clicked horizontally', (done) => {

    renderHorizontal(component(true), node, () => {

      var link = node.querySelectorAll('a')[2];

      var target = node.querySelectorAll('.element')[2];

      var expectedScrollTo = target.getBoundingClientRect().top;

      Rtu.Simulate.click(link);

      var scrollStart = window.scrollX || window.pageXOffset;

      /* Let it scroll, duration is based on param sent to Link */

      setTimeout(() => {

        var scrollStop = Math.round(scrollStart + expectedScrollTo)

        expect(window.scrollX || window.pageXOffset).toEqual(scrollStop);

        expect(link.className).toEqual('active');

        done();

      }, scrollDuration + 500);

    });

  })

  it('is active when clicked to last (5) element vertically', (done) => {

    render(component(false), node, () => {

      var link = node.querySelectorAll('a')[5];

      var target = node.querySelectorAll('.element')[5];

      var expectedScrollTo = target.getBoundingClientRect().top;

      Rtu.Simulate.click(link);

      /* Let it scroll, duration is based on param sent to Link */
      var scrollStart = window.scrollY || window.pageYOffset;

      setTimeout(() => {

        var scrollStop = Math.round(scrollStart + expectedScrollTo)

        expect(window.scrollY || window.pageYOffset).toEqual(scrollStop);

        expect(link.className).toEqual('active');

        done();

      }, scrollDuration + 500);

    });

  })

  it('is active when clicked to last (5) element horizontally', (done) => {

    renderHorizontal(component(true), node, () => {

      var link = node.querySelectorAll('a')[5];

      var target = node.querySelectorAll('.element')[5];

      var expectedScrollTo = target.getBoundingClientRect().top;

      Rtu.Simulate.click(link);

      /* Let it scroll, duration is based on param sent to Link */
      var scrollStart = window.scrollX || window.pageXOffset;

      setTimeout(() => {

        var scrollStop = Math.round(scrollStart + expectedScrollTo)

        expect(window.scrollX || window.pageXOffset).toEqual(scrollStop);

        expect(link.className).toEqual('active');

        done();

      }, scrollDuration + 500);

    });

  })

  it('should call onSetActive vertically', (done) => {

    let onSetActive = sinon.spy();
    let onSetInactive = sinon.spy();

    let component =
      <div>
        <ul>
          <li><Link to="test1" spy={true} smooth={true} duration={scrollDuration}>Test 1</Link></li>
          <li><Link to="test2" spy={true} smooth={true} duration={scrollDuration}>Test 2</Link></li>
          <li><Link to="test3" spy={true} smooth={true} duration={scrollDuration}>Test 3</Link></li>
          <li><Link to="test4" spy={true} smooth={true} duration={scrollDuration} onSetActive={onSetActive} onSetInactive={onSetInactive}>Test 4</Link></li>
          <li><Link to="test5" spy={true} smooth={true} duration={scrollDuration}>Test 5</Link></li>
          <li><Link to="anchor" spy={true} smooth={true} duration={scrollDuration}>Test 6</Link></li>
        </ul>
        <Element name="test1" className="element">test 1</Element>
        <Element name="test2" className="element">test 2</Element>
        <Element name="test3" className="element">test 3</Element>
        <Element name="test4" className="element">test 4</Element>
        <Element name="test5" className="element">test 5</Element>
        <div id="anchor" className="element" style={{ height: "2000px" }}>test 6</div>
      </div>

    render(component, node);

    var link = node.querySelectorAll('a')[3];

    Rtu.Simulate.click(link);

    wait(scrollDuration + 500, () => {
      expect(onSetActive.calledOnce).toEqual(true);

      link = node.querySelectorAll('a')[4];

      Rtu.Simulate.click(link);

      wait(scrollDuration + 500, () => {
        expect(onSetInactive.calledOnce).toEqual(true);
        done();
      })
    })
  });

  it('should call onSetActive horizontally', (done) => {

    let onSetActive = sinon.spy();
    let onSetInactive = sinon.spy();

    let component =
      <div>
        <ul>
          <li><Link to="test1" spy={true} smooth={true} duration={scrollDuration} horizontal={true}>Test 1</Link></li>
          <li><Link to="test2" spy={true} smooth={true} duration={scrollDuration} horizontal={true}>Test 2</Link></li>
          <li><Link to="test3" spy={true} smooth={true} duration={scrollDuration} horizontal={true}>Test 3</Link></li>
          <li><Link to="test4" spy={true} smooth={true} duration={scrollDuration} onSetActive={onSetActive} onSetInactive={onSetInactive} horizontal={true}>Test 4</Link></li>
          <li><Link to="test5" spy={true} smooth={true} duration={scrollDuration} horizontal={true}>Test 5</Link></li>
          <li><Link to="anchor" spy={true} smooth={true} duration={scrollDuration} horizontal={true}>Test 6</Link></li>
        </ul>
        <Element name="test1" className="element">test 1</Element>
        <Element name="test2" className="element">test 2</Element>
        <Element name="test3" className="element">test 3</Element>
        <Element name="test4" className="element">test 4</Element>
        <Element name="test5" className="element">test 5</Element>
        <div id="anchor" className="element" style={{ width: "2000px" }}>test 6</div>
      </div>

    renderHorizontal(component, node);

    var link = node.querySelectorAll('a')[3];

    Rtu.Simulate.click(link);

    wait(scrollDuration + 500, () => {
      expect(onSetActive.calledOnce).toEqual(true);

      link = node.querySelectorAll('a')[4];

      Rtu.Simulate.click(link);

      wait(scrollDuration + 500, () => {
        expect(onSetInactive.calledOnce).toEqual(true);
        done();
      })
    })
  });
});
