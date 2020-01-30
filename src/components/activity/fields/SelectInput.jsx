'use strict';

var React = require('react');
var _ = require('lodash');
//@import "~node_modules/react-select/less/default.less";*/('react-select');

require('./SelectInput.css');

var SelectInput = React.createClass({

	propTypes: {
		/*color: React.PropTypes.oneOf(['white', 'green']),
		label: React.PropTypes.string,
		items: React.PropTypes.array.isRequired,
		onSelect: React.PropTypes.func,
		onDeselect: React.PropTypes.func,
		onChange: React.PropTypes.func*/
	},

	getDefaultProps(){
		/*return {
			color: 'white',
			onSelect: ()=>{},
			onDeselect: ()=>{},
			onChange: ()=>{} 
		};*/
	},



	render(){
		var classes = this.props.className ? this.props.className.split(' ') : [];
		classes.push('SelectInput');
		classes.push('SelectInput--'+this.props.color);

		var label = this.props.label ? (<label>{this.props.label}</label>) : '';

		return (
			<div className="Activity-field">
			{label}
			<div className={classes.join(' ')}>
				<Select 
					name={this.props.name} 
					options={this.props.options}
					value={this.props.value}
					placeholder={this.props.placeholder}
					onChange={this.props.onChange}
					matchProp="label"
					/>
			</div>
			</div>);
	}

});

module.exports = SelectInput;