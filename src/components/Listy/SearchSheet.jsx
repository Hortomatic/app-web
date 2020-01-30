'use strict';

var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

require('./SearchSheet.css')

var SearchSheet = React.createClass({
	
,	propTypes: {
		isActive: React.PropTypes.bool
	,	value: React.PropTypes.string
	,	onChange: React.PropTypes.func.isRequired
	},

	getDefaultProps(){
		return {
			isActive: false
		,	value: ''
		};
	}
	

,	render(){
		return (
			<div className={cx(
				"Listy-Sheet", 
				"Listy-SearchSheet", 
				{
					"Listy-SearchSheet--active": this.props.isActive
				}
			)}>
				<input 
				className="Listy-SearchPanel-input"
				value={this.props.value} 
				ref="searchInput"
				onChange={this.props.onChange} />
			</div>
		);
	}

});

module.exports = SearchSheet;