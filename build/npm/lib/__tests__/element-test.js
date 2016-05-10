import { render, unmountComponentAtNode } from 'react-dom'
import expect from 'expect'
import React from 'react'

var Element = require('../components/Element.js');

var assert = require('assert');

describe('Element', function() {
  
  let node
  beforeEach(function () {
    node = document.createElement('div')
  })

  afterEach(function () {
    unmountComponentAtNode(node)
  })
    
  it('renders only one component', function (done) {
    
    var component = <Element name="test1" className="element">Test 1</Element>

    render(component, node, function() {
        expect(node.textContent).toEqual('Test 1');
        done();
    });

  })

  it('renders two components', function (done) {
    
    var component = <div>
                        <Element name="test1" className="element">A</Element>
                        <Element name="test1" className="element">B</Element>
                    </div>

    render(component, node, function() {
        expect(node.textContent).toEqual('AB');
        done();
    });

  })

});