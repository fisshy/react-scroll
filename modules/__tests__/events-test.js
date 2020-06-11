/* React */
import { render, unmountComponentAtNode } from 'react-dom'
import Rtu from 'react-dom/test-utils'
import React from 'react'
/* Components to test */
import Element from '../components/Element.js';
import Link from '../components/Link.js';
import events from '../mixins/scroll-events.js';
import animateScroll from '../mixins/animate-scroll.js';
/* Test */
import expect from 'expect'
import assert from 'assert';

import { renderHorizontal } from './utility'


describe('Events', () => {

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
        <div id="test6" className="element">test 6</div>
      </div>
    )
  }

  beforeEach(function () {
    node = document.createElement('div');
    document.body.innerHtml = "";
    document.body.appendChild(node)
  });

  afterEach(() => {
    events.scrollEvent.remove('begin');
    events.scrollEvent.remove('end');
    unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  it('direct link calls begin and end event with vertical scroll', (done) => {

    render(component(false), node, () => {

      var link = node.querySelectorAll('a')[5];

      var begin = (to, target) => {
        expect(to).toEqual('test6');
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      var end = (to, target) => {
        expect(to).toEqual('test6')
        expect(Rtu.isDOMComponent(target)).toEqual(true);
        done();
      };

      events.scrollEvent.register('begin', begin);
      events.scrollEvent.register('end', end);

      Rtu.Simulate.click(link);

    });

  });

  it('direct link calls begin and end event with horizontal scroll', (done) => {

    renderHorizontal(component(true), node, () => {

      var link = node.querySelectorAll('a')[5];

      var begin = (to, target) => {
        expect(to).toEqual('test6');
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      var end = (to, target) => {
        expect(to).toEqual('test6')
        expect(Rtu.isDOMComponent(target)).toEqual(true);
        done();
      };

      events.scrollEvent.register('begin', begin);
      events.scrollEvent.register('end', end);

      Rtu.Simulate.click(link);

    });

  });

  it('it calls begin and end event with vertical scroll', (done) => {

    render(component(false), node, () => {

      var link = node.querySelectorAll('a')[2];

      var begin = (to, target) => {
        expect(to).toEqual('test3');
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      var end = (to, target) => {
        expect(to).toEqual('test3')
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      events.scrollEvent.register('begin', begin);
      events.scrollEvent.register('end', end);

      Rtu.Simulate.click(link);


      // wait to actually scroll so it doesn't affect the next test!
      setTimeout(() => {
        done();
      }, scrollDuration * 3);
    });

  });

  it('it calls begin and end event with horizontal scroll', (done) => {

    renderHorizontal(component(true), node, () => {

      var link = node.querySelectorAll('a')[2];

      var begin = (to, target) => {
        expect(to).toEqual('test3');
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      var end = (to, target) => {
        expect(to).toEqual('test3')
        expect(Rtu.isDOMComponent(target)).toEqual(true);
      };

      events.scrollEvent.register('begin', begin);
      events.scrollEvent.register('end', end);

      Rtu.Simulate.click(link);


      // wait to actually scroll so it doesn't affect the next test!
      setTimeout(() => {
        done();
      }, scrollDuration * 3);
    });

  });

  it('calls "end" event on scrollTo vertical', (done) => {
    render(component(false), node, () => {

      var end = (to, target, endPosition) => {
        expect(endPosition).toEqual(100);
        done();
      };

      events.scrollEvent.register('end', end);

      animateScroll.scrollTo(100, scrollDuration);
    });
  });

  it('calls "end" event on scrollTo horizontal', (done) => {
    renderHorizontal(component(true), node, () => {

      var end = (to, target, endPosition) => {
        expect(endPosition).toEqual(100);
        done();
      };

      events.scrollEvent.register('end', end);

      animateScroll.scrollTo(100, {
        duration: scrollDuration,
        horizontal: true
      });
    });
  });

});
