// __tests__/DatePicker-test.js
jest.dontMock('../DatePicker')

describe('DatePicker', function () {
	  var React = require('react')
	  var DatePicker = require('../DatePicker.js')
	  var TestUtils = React.addons.TestUtils


	  it('Requires an onChange handler property', function () {
		  var datePicker = TestUtils.renderIntoDocument(
			<DatePicker />
		)
		  expect(datePicker.textContent).toThrow()
	})

	  it('Accepts a startDate property and initializes the component using that date', function () {

		// Render a checkbox with label in the document
		  var datePicker = TestUtils.renderIntoDocument(
			<DatePicker startDate={new Date()} onChange={(date) => undefined} />
		)

		// Verify that it's Off by default
		  var label = TestUtils.findRenderedDOMComponentWithTag(
			checkbox, 'label')
		  expect(label.textContent).toEqual('Off')

		// Simulate a click and verify that it is now On
		  var input = TestUtils.findRenderedDOMComponentWithTag(
			checkbox, 'input')
		  TestUtils.Simulate.change(input)
		  expect(label.textContent).toEqual('On')
	})


	  xit('changes the text after click', function () {
		  var React = require('react')
		  var CheckboxWithLabel = require('../CheckboxWithLabel.js')
		  var TestUtils = React.addons.TestUtils

		// Render a checkbox with label in the document
		  var checkbox = TestUtils.renderIntoDocument(
			<CheckboxWithLabel labelOn="On" labelOff="Off" />
		)

		// Verify that it's Off by default
		  var label = TestUtils.findRenderedDOMComponentWithTag(
			checkbox, 'label')
		  expect(label.textContent).toEqual('Off')

		// Simulate a click and verify that it is now On
		  var input = TestUtils.findRenderedDOMComponentWithTag(
			checkbox, 'input')
		  TestUtils.Simulate.change(input)
		  expect(label.textContent).toEqual('On')
	})
});
