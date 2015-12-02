
var assert = require('assert');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');

var renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;

var ReactShowdown = require('.');
var ShowdownYoutube = require('showdown-youtube');

var MyCompontent = React.createClass({
	render: function() {
		return React.createElement(this.props.tag, null, this.props.children);
	}
});

describe('ReactShowdown', function() {
	describe('Object', function() {
		it('should be a function', function() {
			assert.equal('function', typeof ReactShowdown);
		});

		it('should support new without options', function() {
			assert.equal('object', typeof new ReactShowdown());
		});

		it('should support new with options', function() {
			assert.equal('object', typeof new ReactShowdown({}));
		});
	});

	describe('convert', function() {
		it('should be a function', function() {
			var reactShowdown = new ReactShowdown();
			assert.equal('function', typeof reactShowdown.convert);
		});

		it('should convert simple markdown to a react element', function() {
			var reactShowdown = new ReactShowdown();
			var reactElement = reactShowdown.convert('# Hello');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<h1 id="hello">Hello</h1>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert little bit more complex markdown to react elements', function() {
			var reactShowdown = new ReactShowdown();
			var reactElement = reactShowdown.convert('# Hello\n\nMore content...');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p>More content...</p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with showdown extension to react elements', function() {
			var reactShowdown = new ReactShowdown({ converter: { extensions: [ 'youtube' ] }});
			var youtubeLink = '![youtube video](https://www.youtube.com/watch?v=PAA9O4E1IM4)';
			var reactElement = reactShowdown.convert('# Hello\n\n' + youtubeLink);
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<iframe width="420px" height="315px" src="//www.youtube.com/embed/PAA9O4E1IM4?rel=0"></iframe></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should keep unknown tags', function() {
			var reactShowdown = new ReactShowdown();
			var reactElement = reactShowdown.convert('# Hello\n\n<MyCompontent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><mycompontent></mycompontent></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements without children', function() {
			var reactShowdown = new ReactShowdown({ components: { 'MyCompontent': MyCompontent }});
			var reactElement = reactShowdown.convert('# Hello\n\n<MyCompontent tag="strong" />');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><strong></strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with react component tag to react elements with children', function() {
			var reactShowdown = new ReactShowdown({ components: { 'MyCompontent': MyCompontent }});
			var reactElement = reactShowdown.convert('# Hello\n\n<MyCompontent tag="strong">More Content...</MyCompontent>');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n<p><strong>More Content...</strong></p></div>';
			assert.equal(actualHtml, expectedHtml);
		});

		it('should convert markdown with comment', function() {
			var reactShowdown = new ReactShowdown();
			var reactElement = reactShowdown.convert('# Hello\n\n<!-- Comment -->');
			var actualHtml = renderToStaticMarkup(reactElement);
			var expectedHtml = '<div><h1 id="hello">Hello</h1>\n\n</div>';
			assert.equal(actualHtml, expectedHtml);
		});
	})
});