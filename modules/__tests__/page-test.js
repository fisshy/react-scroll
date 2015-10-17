import { render, unmountComponentAtNode } from 'react-dom'
import Rtu      from 'react-addons-test-utils'
import expect   from 'expect'
import React    from 'react'
import Element  from '../components/Element.js';
import Link     from '../components/Link.js';
import assert   from 'assert';

describe('Page', function() {
  
  let node
  let component
  beforeEach(function () {
    node = document.createElement('div')
    component =
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><Link to="test1" spy={true} smooth={true} duration={500}>Test 1</Link></li>
                <li><Link to="test2" spy={true} smooth={true} duration={500}>Test 2</Link></li>
                <li><Link to="test3" spy={true} smooth={true} duration={500}>Test 3</Link></li>
                <li><Link to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
                <li><Link to="test5" spy={true} smooth={true} duration={500}>Test 5</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        <Element name="test1" className="element">test 1</Element>
        <Element name="test2" className="element">test 2</Element>
        <Element name="test3" className="element">test 3</Element>
        <Element name="test4" className="element">test 4</Element>
        <Element name="test5" className="element">test 5</Element>

      </div>
  })

  afterEach(function () {
    unmountComponentAtNode(node)
  })
    
  it('renders five elements of link/element', function (done) {

    render(component, node, function() {

        var allLinks = node.querySelectorAll('a');
        var allTargets = node.querySelectorAll('.element');
        
        expect(allLinks.length).toEqual(5);
        expect(allTargets.length).toEqual(5);

        done();

    });

  })

  it('is active when clicked', function(done) {
    
    render(component, node, function() {

        var allLinks = node.querySelectorAll('a');
        var allTargets = node.querySelectorAll('.element');
        
        expect(allLinks.length).toEqual(5);
        expect(allTargets.length).toEqual(5);

        console.log(allLinks[3]);

        done();

    });

  })

});