'use strict';

var React = require('react');
var _ = require('lodash');

require('./SectionTabs.css');

var SectionTabs = React.createClass({

	propTypes: {
		items: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func,
		onItemClick: React.PropTypes.func
	},

	getDefaultProps(){
		return {
			onChange: ()=>{} 
		};
	},

	handleItemClick(item, index, ev){
		item.isActive = !item.isActive;
		this.props.onChange(item, index);
		if(item.onClick)
			item.onClick(ev);
	},

	render(){
		var classes = this.props.className ? this.props.className.split(' ') : [];
		classes.push('SectionTabs');

		var label = this.props.label ? (<label>{this.props.label}</label>) : '';
		var items = _.map(this.props.items, (item, i)=>{
			var classes = ['SectionTabs-item'];
			if(item.isActive)
				classes.push('isActive')
			return (<div className={classes.join(' ')} onClick={_.partial(this.handleItemClick, item, i)} key={item.value}>{item.label}</div>);
		});
		return (
			<div className={classes.join(' ')}>
				{items}
			</div>
		);
	}

});

module.exports = SectionTabs;