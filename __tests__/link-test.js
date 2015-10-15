jest.dontMock('../modules/components/Link.js');

describe('Link', function () {
		
	it('a should have value test 1', function () {
		
		var TestUtils 	= require('react-addons-test-utils');
		var Link 		= require('../modules/components/Link.js');
		var React 		= require('react');

    	var link = TestUtils.renderIntoDocument(
	      <Link to="test1" spy={true} smooth={true} duration={500}>test 1</Link>
	    );

    	expect(link.props.children).toEqual("test 1");

	});

})