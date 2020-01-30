'use strict';

var React = require('react');
var cx = require('classnames');
var uncontrollable = require('uncontrollable');
var _ = require('lodash');

const Sheet = require('./Sheet.jsx');

var FilterSheet = React.createClass({

	displayName: 'ListItem',
	
	propTypes: {
		isActive: React.PropTypes.bool
	},

	getDefaultProps(){
		return {
			isActive: false
		};
	},


	render(){

		return (
			<div className={cx()}>

			</div>);
	}

});

module.exports = ListItem;