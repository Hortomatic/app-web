'use strict';

var React = require('react');
var _ = require('lodash');

require('./PillButtons.css');

var PillButtons = React.createClass({

	propTypes: {
		color: React.PropTypes.oneOf(['white', 'green']),
		items: React.PropTypes.array.isRequired,
		onSelect: React.PropTypes.func,
		onDeselect: React.PropTypes.func,
		onChange: React.PropTypes.func
	},

	getDefaultProps(){
		return {
			color: 'white',
			onSelect: ()=>{},
			onDeselect: ()=>{},
			onChange: ()=>{} 
		};
	},

	handleItemClick(item, ev){
		var wasSelected = item.isSelected;
		item.isSelected = !item.isSelected;

		if(wasSelected){
			this.props.onDeselect(item);
		}else{
			this.props.onSelect(item);
		}		
		
		this.props.onChange(item);
	},

	render(){
		var classes = this.props.className ? this.props.className.split(' ') : [];
		classes.push('PillButtons');
		classes.push('PillButtons--'+this.props.color);

		var label = this.props.label ? (<label>{this.props.label}</label>) : '';
		var items = _.map(this.props.items, (item, i)=>{
			var classes = ['PillButtons-item'];
			if(item.isSelected)
				classes.push('isSelected')
			return (<div className={classes.join(' ')} onClick={this.handleItemClick.bind(this, item)} key={i}>{item.label}</div>);
		});
		return (
			<div className={classes.join(' ')}>
				{items}
			</div>
		);
	}

});

module.exports = PillButtons;