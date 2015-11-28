## React Scroll

Directive for basic scrolling and smooth scrolling.
I love contributions, just make sure your test passes.

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

var React = require('react');
var Scroll = require('react-scroll'); 

var Link = Scroll.Link;
var Element = Scroll.Element;

var Events = Scroll.Events;

var Section = React.createClass({
  mixins: [Events],
  componentDidMount: function() {

    this.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });

    this.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });

  },
  componentWillUnmount: function() {
    this.scrollEvent.remove('begin');
    this.scrollEvent.remove('end');
  },
  render: function () {
  	return (
  		<Link to="test1" spy={true} smooth={true} offset={50} duration={500} >Test 1</Link>
		<Button className="btn" type="submit" value="Test 2" to="test2" spy={true} smooth={true} offset={50} duration={500} >Test 2</Button>

  		<Element name="test1" className="element">
  		  test 1
  		</Element>

  		<Element name="test2" className="element">
  		  test 2
  		</Element>
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
> Simply just include the mixins!

```js
var React = require('react');
var Scroll = require('react-scroll'); 
var Helpers = Scroll.Helpers;

var Element = React.createClass({
  mixins: [Helpers.Element],
  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

var Link = React.createClass({
  mixins: [Helpers.Scroll],
  render: function () {
    return (
      <a onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});

```
