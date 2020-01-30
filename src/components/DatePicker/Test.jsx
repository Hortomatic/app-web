'use strict';

var Immutable = require('immutable');
var React = require('react');
var Morearty = require('morearty');
var moment = require('moment');
var Router = require('react-router');
//var bounce = require('bounce.js');

//var ClassesMixin = require('react-classes');
var AppContext = require('Context.js');

var DatePicker = require('./DatePicker.jsx');

require('./Test.css');

var TestDatePicker = React.createClass({
	mixins: [
		//Morearty.Mixin, 
		AppContext.Mixin
	],

	render(){
		var mainStyle = {
			display: 'flex',
			flex: '1',
			flexWrap: 'wrap'
		},
		one = {
			border:'2px solid blue',
			flex: '1 0 400px'
		},
		two = {
			border:'2px solid red',
			flex: '1'
		},
		three = {
			border:'2px solid yellow',
			flex: '1 0 100%',
			fontSize: '32',
			fontWeight: 700
		};
		
		
		return (
			<div style={mainStyle} className="DatePickerTest">
				<div style={one}><DatePicker height={200} key="one" tabIndex={1} /></div>
				<div style={two}><DatePicker height={300} key="two" tabIndex={2} /></div>
				<div style={three}><DatePicker height={520} rowHeight={50} showDayName={true} key="three" tabIndex={3} /></div>
			</div>	
		);
	}

});

module.exports = TestDatePicker;