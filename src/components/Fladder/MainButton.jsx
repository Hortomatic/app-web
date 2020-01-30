'use strict';

var React = require('react');
var cx = require('classnames');

var FladderButton = React.createClass({

	propTypes: {
		isActive: React.PropTypes.array
	},

	getDefaultProps(){
		return {
			text: '',
			onClick: ()=>{}
		}
	},
	
	handleClick(ev){
		this.props.onClick(ev);
	},

	render(){
		var classes = [this.props.className] || [];
		classes.push('Fladder-Button');
		classes.push('Fladder-MainButton');

		if(this.props.isActive)
			classes.push('Fladder-MainButton--isActive');

		return (
			<div className={classes.join(" ")} onClick={this.handleClick}>
				<div className="Fladder-Button-Circle"><i className="fa fa-plus"></i></div>
				<span className="Fladder-Button-label">{this.props.children}</span>
			</div>
		);
	}
});

module.exports = FladderButton;

