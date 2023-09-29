<h1 align='center'> React Scroll</h1>

<p align='center'>React component for animating vertical scrolling

### Install

```js
$ npm install react-scroll
```
or

```
$ yarn add react-scroll
```

### Run

```js
$ npm install
$ npm test
$ npm start
```

or

```js
$ yarn
$ yarn test
$ yarn start

```

### Examples

Checkout examples

Live example

> [Basic](https://codesandbox.io/s/basic-6t84k)

> [Basic-Keydown](https://codesandbox.io/s/l94kv62o4m)

> [Container](https://codesandbox.io/s/3zznv27l5)

> [With-hash](https://codesandbox.io/s/y0zzrk1v1j)

> [With-overflow](https://codesandbox.io/s/l94kv62o4m)

> [Code](https://github.com/fisshy/react-scroll/blob/master/examples/basic/app.js)

### Usage

```js
import React, { useEffect } from 'react';
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';

const Section = () => {

  // useEffect is used to perform side effects in functional components.
  // Here, it's used to register scroll events and update scrollSpy when the component mounts.
  useEffect(() => {
    
    // Registering the 'begin' event and logging it to the console when triggered.
    Events.scrollEvent.register('begin', (to, element) => {
      console.log('begin', to, element);
    });

    // Registering the 'end' event and logging it to the console when triggered.
    Events.scrollEvent.register('end', (to, element) => {
      console.log('end', to, element);
    });

    // Updating scrollSpy when the component mounts.
    scrollSpy.update();

    // Returning a cleanup function to remove the registered events when the component unmounts.
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  // Defining functions to perform different types of scrolling.
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const scrollToBottom = () => {
    scroll.scrollToBottom();
  };

  const scrollTo = () => {
    scroll.scrollTo(100); // Scrolling to 100px from the top of the page.
  };

  const scrollMore = () => {
    scroll.scrollMore(100); // Scrolling an additional 100px from the current scroll position.
  };

  // Function to handle the activation of a link.
  const handleSetActive = (to) => {
    console.log(to);
  };

  // Rendering the component's JSX.
  return (
  <div>
    {/* Link component to scroll to "test1" element with specified properties */}
    <Link 
      activeClass="active" 
      to="test1" 
      spy={true} 
      smooth={true} 
      offset={50} 
      duration={500} 
      onSetActive={handleSetActive}
    >
      Test 1
    </Link>

    {/* Other Link and Button components for navigation, each with their unique properties and targets */}
    {/* ... */}

    {/* Element components that act as scroll targets */}
    <Element name="test1" className="element">
      test 1
    </Element>
    <Element name="test2" className="element">
      test 2
    </Element>
    <div id="anchor" className="element">
      test 6 (anchor)
    </div>

    {/* Links to elements inside a specific container */}
    <Link to="firstInsideContainer" containerId="containerElement">
      Go to first element inside container
    </Link>
    <Link to="secondInsideContainer" containerId="containerElement">
      Go to second element inside container
    </Link>

    {/* Container with elements inside */}
    <div className="element" id="containerElement">
      <Element name="firstInsideContainer">
        first element inside container
      </Element>
      <Element name="secondInsideContainer">
        second element inside container
      </Element>
    </div>

    {/* Anchors to trigger scroll actions */}
    <a onClick={scrollToTop}>To the top!</a>
    <br/>
    <a onClick={scrollToBottom}>To the bottom!</a>
    <br/>
    <a onClick={scrollTo}>Scroll to 100px from the top</a>
    <br/>
    <a onClick={scrollMore}>Scroll 100px more from the current position!</a>
  </div>
);

};

export default Section;


```

### Props/Options

<table>
<tr>
<td>
activeClass
</td>
<td>
 class applied when element is reached
</td>
</tr>
<tr>
<td>
activeStyle
</td>
<td>
 style applied when element is reached
</td>
</tr>
<tr>
<td>
to
</td>
<td>
 Target to scroll to
</td>
</tr>


<tr>
<td>
containerId
</td>
<td>
 Container to listen for scroll events and to perform scrolling in
</td>
</tr>

<tr>
<td>
spy
</td>
<td>
 Make Link selected when scroll is at its targets position
</td>
</tr>

<tr>
<td>
hashSpy
</td>
<td>
Update hash based on spy, containerId has to be set to scroll a specific element
</td>
</tr>

<tr>
<td>
smooth
</td>
<td>
Animate the scrolling
</td>
</tr>

<tr>
<td>
offset
</td>
<td>
Scroll additional px ( like padding )
</td>
</tr>

<tr>
<td>
duration
</td>
<td>
time of the scroll animation - can be a number or a function (`function (scrollDistanceInPx) { return duration; }`), that allows more granular control at run-time
</td>
</tr>

<tr>
<td>
delay
</td>
<td>
Wait x milliseconds before scroll</td>
</tr>

<tr>
<td>
isDynamic 
</td>
<td>
In case the distance has to be recalculated - if you have content that expands etc.</td>
</tr>

<tr>
<td>
onSetActive
</td>
<td>
Invoke whenever link is being set to active
</td>
</tr>

<tr>
<td>
onSetInactive
</td>
<td>
Invoke whenever link is lose the active status
</td>
</tr>

<tr>
<td>
ignoreCancelEvents
</td>
<td>
 Ignores events which cancel animated scrolling
</td>
</tr>

<tr>
<td>
horizontal 
</td>
<td>
 Whether to scroll vertically (`false`) or horizontally (`true`) - default: `false`
</td>
</tr>

<tr>
<td>
spyThrottle 
</td>
<td>
Time of the spy throttle - can be a number
</td>
</tr>

</table>

### Full example

```js
<Link activeClass="active"
      to="target"
      spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}
      delay={1000}
      isDynamic={true}
      onSetActive={this.handleSetActive}
      onSetInactive={this.handleSetInactive}
      ignoreCancelEvents={false}
      spyThrottle={500}
>
  Your name
</Link>
```

### Scroll Methods

> Scroll To Top

```js
import { animateScroll } from 'react-scroll';

const options = {
  // your options here, for example:
  duration: 500,
  smooth: true,
};

animateScroll.scrollToTop(options);

```

> Scroll To Bottom

```js
import { animateScroll } from 'react-scroll';

const options = {
  // Your options here, for example:
  duration: 500,
  smooth: true,
};

animateScroll.scrollToBottom(options);

```

> Scroll To (position)

```js
import { animateScroll } from 'react-scroll';

const options = {
  // Your options here, for example:
  duration: 500,
  smooth: true,
};

// Scroll to 100 pixels from the top of the page
animateScroll.scrollTo(100, options);


```

> Scroll To (Element)

animateScroll.scrollTo(positionInPixels, props = {});

```js
import { Element, scroller } from 'react-scroll';

<Element name="myScrollToElement"></Element>

// Somewhere else, even another file
scroller.scrollTo('myScrollToElement', {
  duration: 1500,
  delay: 100,
  smooth: true,
  containerId: 'ContainerElementID',
  offset: 50, // Scrolls to element + 50 pixels down the page
  // ... other options
});

```

> Scroll More (px)

```js
import { animateScroll } from 'react-scroll';

const options = {
  // Your options here, for example:
  duration: 500,
  smooth: true,
};

// Scroll an additional 10 pixels down from the current scroll position
animateScroll.scrollMore(10, options);

```

### Scroll events

> begin - start of the scrolling

```js
import { Events } from 'react-scroll';

Events.scrollEvent.register('begin', function(to, element) {
  console.log('begin', to, element);
});

```

> end - end of the scrolling/animation

```js

import { Events } from 'react-scroll';

Events.scrollEvent.register('end', function(to, element) {
  console.log('end', to, element);
});

```

> Remove events

```js
import { Events } from 'react-scroll';

Events.scrollEvent.remove('begin');
Events.scrollEvent.remove('end');

```

#### Create your own Link/Element
> Simply just pass your component to one of the high order components (Element/Scroll)

```js
import React from 'react';
import { ScrollElement, ScrollLink } from 'react-scroll';

const Element = (props) => {
  return (
    <div {...props} ref={(el) => { props.parentBindings.domNode = el; }}>
      {props.children}
    </div>
  );
};

export const ScrollableElement = ScrollElement(Element);

const Link = (props) => {
  return (
    <a {...props}>
      {props.children}
    </a>
  );
};

export const ScrollableLink = ScrollLink(Link);

```

### Scroll Animations
> Add a custom easing animation to the smooth option. This prop will accept a Boolean if you want the default, or any of the animations listed below

```js
import { scroller } from 'react-scroll';

scroller.scrollTo('myScrollToElement', {
  duration: 1500,
  delay: 100,
  smooth: 'easeInOutQuint',
  containerId: 'ContainerElementID',
  // ... other options
});

```


> List of currently available animations:

```
linear
	- no easing, no acceleration.
easeInQuad
	- accelerating from zero velocity.
easeOutQuad
	- decelerating to zero velocity.
easeInOutQuad
	- acceleration until halfway, then deceleration.
easeInCubic
	- accelerating from zero velocity.
easeOutCubic
	- decelerating to zero velocity.
easeInOutCubic
	- acceleration until halfway, then deceleration.
easeInQuart
	- accelerating from zero velocity.
easeOutQuart
	- decelerating to zero velocity.
easeInOutQuart
	-  acceleration until halfway, then deceleration.
easeInQuint
	- accelerating from zero velocity.
easeOutQuint
	- decelerating to zero velocity.
easeInOutQuint
	- acceleration until halfway, then deceleration.
```

A good visual reference can be found at [easings.net](http://easings.net/)

#### Changelog
- [See the CHANGELOG](./CHANGELOG.md)
