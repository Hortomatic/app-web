'use strict'

var React = require('react');


var ButtonPanel = React.createClass({

	propTypes: {
		color: React.PropTypes.oneOf( ['white', 'yellow'] ),
		disabled: React.PropTypes.bool
	},
	
	getDefaultProps(){
		return {
			color: 'white',
			disabled: false
		}
	},
		
	render(){
		var classes = [this.props.className] || [];
		classes.push('ButtonPanel');
		classes.push('ButtonPanel--'+this.props.color);
		if(this.props.disabled)
			classes.push('disabled');
			
		var lefties = [], righties = [];
		
		React.Children.forEach(this.props.children, (child, index) => {
			(!child.props || child.props.align==='left' ? lefties : righties).push(child);
		}, this);
		
		return ( <div className={classes.join(" ")}>
			<div className="ButtonPanel-lefties">{lefties}</div>
			<div className="ButtonPanel-righties">{righties}</div>
		</div> );
	}
});

module.exports = ButtonPanel;

