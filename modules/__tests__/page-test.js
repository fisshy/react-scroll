/* React */
import { render, unmountComponentAtNode } from 'react-dom'
import Rtu      from 'react-addons-test-utils'
import React    from 'react'
/* Components to test */
import Element    from '../components/Element.js';
import Link       from '../components/Link.js';
import DirectLink from '../components/DirectLink.js';
import events     from '../mixins/scroll-events.js';
/* Test */
import expect   from 'expect'
import assert   from 'assert';


describe('Page', () => {
  
  let node = document.createElement('div');
  
  document.body.appendChild(node)

  let scrollDuration = 10;

  let component =
      <div>
        <ul>
          <li><Link to="test1" spy={true} smooth={true} duration={scrollDuration}>Test 1</Link></li>
          <li><Link to="test2" spy={true} smooth={true} duration={scrollDuration}>Test 2</Link></li>
          <li><Link to="test3" spy={true} smooth={true} duration={scrollDuration}>Test 3</Link></li>
          <li><Link to="test4" spy={true} smooth={true} duration={scrollDuration}>Test 4</Link></li>
          <li><Link to="test5" spy={true} smooth={true} duration={scrollDuration}>Test 5</Link></li>
          <li><DirectLink to="test6" spy={true} smooth={true} duration={scrollDuration}>Test 6</DirectLink></li>
        </ul>
        <Element name="test1" className="element">test 1</Element>
        <Element name="test2" className="element">test 2</Element>
        <Element name="test3" className="element">test 3</Element>
        <Element name="test4" className="element">test 4</Element>
        <Element name="test5" className="element">test 5</Element>
        <Element name="test6" className="element">test 6</Element>
      </div>

  beforeEach(() => {
    events.scrollEvent.remove('begin');
    events.scrollEvent.remove('end');
  });

  afterEach(function () {
    unmountComponentAtNode(node)
  });
    
  it('renders six elements of link/element', (done) => {

    render(component, node, () => {

        var allLinks = node.querySelectorAll('a');
        var allTargets = node.querySelectorAll('.element');
        
        expect(allLinks.length).toEqual(6);
        expect(allTargets.length).toEqual(6);

        done();

    });

  })

  it('all targets has name and class', (done) => {

    render(component, node, () => {

        var allTargets = node.querySelectorAll('.element');
          
        [].forEach.call(allTargets, (element, i) => {
          expect(element.className).toEqual('element');
          expect(element.getAttribute('name')).toEqual('test' + ( i + 1 ));
        });

        done();

    });

  })

  it('is active when clicked', (done) => {
    
    render(component, node, () => {

        var link = node.querySelectorAll('a')[4];

        var target = node.querySelectorAll('.element')[4];

        var expectedScrollTo = target.getBoundingClientRect().top;

        Rtu.Simulate.click(link);

        /* Let it scroll, duration is based on param sent to Link */
        
        setTimeout(() => {

          expect(expectedScrollTo).toEqual(window.scrollY);

          expect(link.className).toEqual('active');

          done();

        }, scrollDuration + 50);

    });

  })

});
