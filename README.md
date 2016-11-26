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
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;


var Section = React.createClass({
  componentDidMount: function() {

    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });

    scrollSpy.update();

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
  handleSetActive: function(to) {
    console.log(to);
  },
  render: function () {
  	return (
      <div>
        <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500} onSetActive={this.handleSetActive}>
          Test 1
        </Link>
        <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500} delay={1000}>
          Test 2 (delay)
        </Link>
        <Link className="test6" to="anchor" spy={true} smooth={true} duration={500}>
          Test 6 (anchor)
        </Link>
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


        <Link to="firstInsideContainer" containerId="containerElement">
          Go to first element inside container
        </Link>

        <Link to="secondInsideContainer" containerId="containerElement">
          Go to second element inside container
        </Link>
        <div className="element" id="containerElement">
          <Element name="firstInsideContainer">
            first element inside container
          </Element>

          <Element name="secondInsideContainer">
            second element inside container
          </Element>
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

> containerId - container to listen for scroll events and to perform scrolling in

> spy - make Link selected when scroll is at its targets position

> smooth - animate the scrolling

> offset - scroll additional px ( like padding )

> duration - time of the scroll animation

> delay - wait x milliseconds before scroll

> isDynamic - in case the distance has to be recalculated - if you have content that expands etc.

> onSetActive - invoke whenever link is being set to active

> ignoreCancelEvents - ignores events which cancel animated scrolling

```js
<Link activeClass="active"
      to="target"
      spy={true}
      smooth={true}
      offset={50}
      duration={500}
      delay={1000}
      isDynamic={true}
      onSetActive={this.handleSetActive}
      ignoreCancelEvents={false}
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
      <div {...this.props}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Helpers.Element(Element);

var Link = React.createClass({
  render: function () {
    return (
      <a {...this.props}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Helpers.Scroll(Link);

```

#### Changelog
> v1.4.0
- It's now possible to nest scroll areas and get a callback when "link is active"

> v1.3.0
- Remove directlink, now just use Link.

> v1.2.0
- Now using passive event listeners.

> v1.1.0
- now possible to set initial active link on componentDidMount ( see README or examples code )
- removed unnecessary events for scroll.

> v1.0.24
- you can now pass any native property to Link/Element
- patched minor bugs from v1.0.21 > v1.0.24

> v1.0.21
- scrollToBottom and scrollMore now works inside a container.

> v1.0.20
- Published, somehow the publish failed

> v1.0.19
- Property warnings has now been removed.

> v1.0.18
- It's now possible to scroll within a container, checkout the code under examples.

> v1.0.17
- isDynamic property has been added. To allow scrollSpy to recalculate components that expand

#### Things that needs to be done - feel free to contribute.
- Being able to use react-scroll within a div.
- Integrate react-scroll with react-router
- Hash-scrolling.
