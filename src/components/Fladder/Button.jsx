'use strict';

var React = require('react');
var cx = require('classnames');

var FladderButton = React.createClass({

	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},

	getDefaultProps(){
		return {
			text: '',
			onClick: ()=>{}
		}
	},

	render(){
		var classes = [this.props.className] || [];
		classes.push('Fladder-Button');

		return (
			<div className={classes.join(" ")} onClick={this.props.onClick}>
				<div className="Fladder-Button-Circle"><i className="fa fa-plus"></i></div>
				{this.props.children}
			</div>
		);
	}
	
});

module.exports = FladderButton;