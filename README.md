## React Scroll

Directive for basic scrolling and smooth scrolling.

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

var Link       = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;

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
  scrollToBottom: function() {
    scroll.scrollToBottom();
  },
  scrollTo: function() {
    scroll.scrollTo(100);
  },
  scrollMore: function() {
    scroll.scrollMore(100);
  },
  render: function () {
  	return (
      <div>
        <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500} >
          Test 1
        </Link>
        <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500} delay={1000}>
          Test 2 (delay)
        </Link>
        <DirectLink className="test6" to="anchor" spy={true} smooth={true} duration={500}>
          Test 6 (anchor)
        </DirectLink>
        <Button activeClass="active" className="btn" type="submit" value="Test 2" to="test2" spy={true} smooth={true} offset={50} duration={500} >
          Test 2
        </Button>

        <Element name="test1" className="element">
          test 1
        </Element>

        <Element name="test2" className="element">
          test 2
        </Element>

        <div id="anchor" className="element">
          test 6 (anchor)
        </div>

        <a onClick={this.scrollToTop}>To the top!</a>
        <br/>
        <a onClick={this.scrollToBottom}>To the bottom!</a>
        <br/>
        <a onClick={this.scrollTo}>Scroll to 100px from the top</a>
        <br/>
        <a onClick={this.scrollMore}>Scroll 100px more from the current position!</a>
      </div>
	);
  }
});

React.render(
  <Section />,
  document.getElementById('example')
);

```

### Props/Options

> activeClass - class applied when element is reached

> to - target to scroll to

> spy - make Link selected when scroll is at it's targets position

> smooth - animate the scrolling

> offset - scroll additional px ( like padding )

> duration - time of the scroll animation

> delay - wait x seconds before scroll

```js
<Link activeClass="active" 
      to="target" 
      spy={true} 
      smooth={true} 
      offset={50} 
      duration={500} 
      delay={1000}
>
  Your name
</Link>
```

### Scroll Methods

> Scroll To Top

```js

var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

scroll.scrollToTop(options);

```

> Scroll To Bottom

```js

var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

scroll.scrollToBottom(options);

```

> Scroll To (position)

```js

var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

scroll.scrollTo(100, options);

```

> Scroll To (Element)

animateScroll.scrollTo(positionInPixels, props = {});

```js

var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

<Element name="myScrollToElement"></Element>

// Somewhere else, even another file
scroller.scrollTo('myScrollToElement', {
  duration: 1500,
  delay: 100,
  smooth: true,
})

```

> Scroll More (px)

```js

var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

scroll.scrollMore(10, options);

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

