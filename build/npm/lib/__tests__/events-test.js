/* React */
import { render, unmountComponentAtNode } from 'react-dom'
import Rtu      from 'react-addons-test-utils'
import React    from 'react'
/* Components to test */
import Element  from '../components/Element.js';
import Link     from '../components/Link.js';
import DirectLink from '../components/DirectLink.js';
import events   from '../mixins/scroll-events.js';
/* Test */
import expect   from 'expect'
import assert   from 'assert';


describe('Events', () => {
  
  console.log("test");

  let node = document.createElement('div');
  
  document.body.innerHtml = "";

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
        <div id="test6" className="element">test 6</div>
      </div>

  beforeEach(function () {
    unmountComponentAtNode(node)
  });
    
  it('direct link calls begin and end event', (done) => {
    
    render(component, node, () => {

        var link = node.querySelectorAll('a')[5];

        var begin = (to, target) => {
          expect(to).toEqual('test6');
          expect(Rtu.isDOMComponent(target)).toEqual(true);
        };

        var end = (to, target) => {
          expect(to).toEqual('test6')
          expect(Rtu.isDOMComponent(target)).toEqual(true);
        };

        events.scrollEvent.register('begin', begin);
        events.scrollEvent.register('end', end);

        Rtu.Simulate.click(link);

        done();
    });

  })

  it('it calls begin and end event', (done) => {
    
    render(component, node, () => {

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

        done();
    });

  })

});
