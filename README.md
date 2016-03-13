## React Scroll

Directive for basic scrolling and smooth scrolling.
Mixins has been removed and replaced with high ordered components (2016-02-02)

### Install
```js
$ npm install react-scroll
```

### Run
```js
$ npm install
$ npm test
$ npm run examples
```

### Examples
Checkout examples
> Basic
>> [Live](http://fisshy.github.io/react-scroll-example/basic/index.html)
>> Or
>> [Code](https://github.com/fisshy/react-scroll/blob/master/examples/basic/app.js)

### Usage
```js

var React   = require('react');
var Scroll  = require('react-scroll'); 

var Link    = Scroll.Link;
var Element = Scroll.Element;
var Events  = Scroll.Events;
var scroll  = Scroll.animateScroll;

var Section = React.createClass({
  componentDidMount: function() {

    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });

  },
  componentWillUnmount: function() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  },
  scrollToTop: function() {
    scroll.scrollToTop();
  },
  render: function () {
  	return (
  		<div>
    		<Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500} >Test 1</Link>
  		  <Button activeClass="active" className="btn" type="submit" value="Test 2" to="test2" spy={true} smooth={true} offset={50} duration={500} >Test 2</Button>

    		<Element name="test1" className="element">
    		  test 1
    		</Element>

    		<Element name="test2" className="element">
    		  test 2
    		</Element>
        
        <a onClick={this.scrollToTop}>To the top!</a>
  		</div>
	);
  }
});

React.render(
  <Section />,
  document.getElementById('example')
);

```

### Scroll events

> begin - start of the scrolling

```js

var Scroll = require('react-scroll'); 
var Events = Scroll.Events;

Events.scrollEvent.register('begin', function(to, element) {
  console.log("begin", to, element);
});

```

> end - end of the scrolling/animation

```js

Events.scrollEvent.register('end', function(to, element) {
  console.log("end", to, element);
});

```


> Remove events

```js 

Events.scrollEvent.remove('begin');
Events.scrollEvent.remove('end');

```


#### Create your own Link/Element
> Simply just pass your component to one of the high order components (Element/Scroll)

```js
var React   = require('react');
var Scroll  = require('react-scroll'); 
var Helpers = Scroll.Helpers;

var Element = React.createClass({
  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Helpers.Element(Element);

var Link = React.createClass({
  render: function () {
    return (
      <a>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Helpers.Scroll(Link);

```

#### Things that needs to be done - feel free to contribute.
- Being able to use react-scroll within a div.
- Integrate react-scroll with react-router
- Hash-scrolling.

