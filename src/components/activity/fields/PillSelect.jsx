'use strict';

var React = require('react');
var _ = require('lodash');

var PillButtons = require('../../PillButtons/PillButtons.jsx');

require('./PillSelect.css');

var PillSelect = React.createClass({

	propTypes: {
		label: React.PropTypes.string,
	},

	render(){
		return (
			<div className="Activity-field">
				{this.props.label}
				<PillButtons {...this.props} />
			</div>);
	}

});

module.exports = PillSelect;