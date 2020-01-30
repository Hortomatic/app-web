'use strict'

var React = require('react');
var cx = require('classnames');


var FladderOverlay = React.createClass({

	propTypes: {
	},

	getDefaultProps(){
		return {
		}
	},

	render(){	
		var classes = cx({
			"Fladder-Overlay": true,
			"Fladder-Overlay--isOpen": this.state.isOpen
		});
		
		return (		
			<div className={classes}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = FladderOverlay;

