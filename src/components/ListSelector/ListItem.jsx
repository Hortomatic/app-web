'use strict';

var React = require('react');
var _ = require('lodash');

var ListItem = React.createClass({

	displayName: 'ListItem',
	
	propTypes: {
		isSelected: React.PropTypes.bool,
		onClick: React.PropTypes.func
	},

	getDefaultProps(){
		return {
			isSelected: false,
			onClick: ()=>{} 
		};
	},
	
	handleClick( ev ){
		//console.log('Item clicked', this.props);
		this.props.onClick();
	},

	render(){
		var classes = ['ListSelector-ListItem'];
		if(this.props.isSelected){
			classes.push('ListSelector-ListItem--selected');
		}
		//console.log('ListItem render', this.props.children);
		var label;
		
		if(this.props.label){
			label = !_.isArray(this.props.label) ? [this.props.label] : this.props.label;
			if(label.length===1){
				label = <div className="ListSelector-ListItem-label">
					{label[0]}{this.props.children}
				</div>;
			}else
			if(label.length===2){
				label = <div className="ListSelector-ListItem-label ListSelector-ListItem-label-twoLiner">
					<div className="ListSelector-ListItem-label-twoLiner-primary">{label[0]}</div>
					<div className="ListSelector-ListItem-label-twoLiner-secondary">{label[1]}</div>
					{this.props.children}
				</div>;
			}
		}else{
			label = this.props.children;
		}
		
		return (
			<div className={classes.join(' ')} onClick={this.handleClick}>
				{label}
			</div>);
	}

});

module.exports = ListItem;