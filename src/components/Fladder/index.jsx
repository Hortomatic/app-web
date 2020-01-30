'use strict';

var React = require('react');
var cx = require('classnames');

var Portal = require('react-portal');

var Overlay = require('./Overlay.jsx');
var Button = require('./Button.jsx');
var MainButton = require('./MainButton.jsx');

require('./Fladder.css');

var Fladder = React.createClass({

	propTypes: {
		buttons: React.PropTypes.array
	},

	getDefaultProps(){
		return {
			buttons:[]
		}
	},
	
	getInitialState(){
		return {
			isOpen: false,
			isTransitioning: false
		};
	},
	
	handleClick(){
		this.open();
	},
	
	open(){
		//transition open, then set isOpen to true
		this.setState({
			isOpen:true
		});
	},
	
	close(){
		//transition close, then set isOpen to false
		this.setState({
			isOpen:false
		});
	},

	render(){
		var classes = [this.props.className] || [];
		classes.push('Fladder');
		


		return (		
			<div className="Fladder">
				<MainButton ref="mainButton" isActive={this.state.isOpen} onClick={this.handleClick}>Cancel</MainButton>
				<Portal isOpened={this.state.isOpen} closeOnEsc={true} closeOnOutsideClick={true}>
					<Overlay isOpen={this.state.isOpen}>
						{this.props.buttons.map(button=>{
							<Button onClick={ev=>{this.close(); button.onClick();} }>{button.label}</Button>
						})}
					</Overlay>
				</Portal>
			</div>
		);
	}
});

module.exports = Fladder;

