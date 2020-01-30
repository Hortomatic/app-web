'use strict'

var React = require('react');
var cx = require('classnames');

require('./FloatingAdd.css')

var FloatingAdd = React.createClass({

	propTypes: {
		color: React.PropTypes.oneOf(['red', 'yellow']),
		disabled: React.PropTypes.bool,
		label: React.PropTypes.string,
		onClick: React.PropTypes.func,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		labelAlign: React.PropTypes.oneOf(['left', 'right']),
		tabIndex:React.PropTypes.number
	},

	getDefaultProps(){
		return {
			color: 'white',
			disabled: false,
			labelAlign: 'left',
			onClick: ()=>{},
			onFocus: ()=>{},
			onBlur: ()=>{},
			tabIndex:-1
		}
	},
	
	getInitialState(){
		return {
			isFocused:false,
			isActive:false
		}
	},
	
	handleClick(ev){
		if(!this.props.disabled)
			this.props.onClick(ev);
	},
	
	handleFocus(ev){
		this.setState({
			isFocused: true
		});
	},
	
	handleBlur(ev){
		this.setState({
			isFocused: false,
			isActive: false
		});
	},
	
	handleMouseDown(ev){
		this.setState({
			isActive: true
		});
	},
	
	handleMouseUp(ev){
		this.setState({
			isActive: false
		});
	},

	render(){

		var {
			className
		, onClick
		, onFocus
		, onBlur
		, color
		, disabled
		, label
		, labelAlign
		, ...props } = this.props;
	
		return ( 
			<div 
			className={cx(className, 'FloatingAddButton', 'FloatingAddButton--'+this.props.color, {
				'disabled': this.props.disabled
			,	'FloatingAddButton--labelRight': this.props.align==='right'
			, 'FloatingAddButton--labelLeft': this.props.align!=='right' 
			,	'FloatingAddButton--focused': this.state.isFocused
			, 'FloatingAddButton--active': this.state.isActive
			})} 
			onClick={this.handleClick} 
			onMouseDown={this.handleMouseDown} 
			onMouseUp={this.handleMouseUp} 
			onFocus={this.handleFocus} 
			onBlur={this.handleBlur} 
			{...props}>
				<span className="FloatingAddButton-Inner"><i className="fa fa-plus" /></span>
				{!this.props.label || <span className="FloatingAddButton-Label">{this.props.label}</span>}
			</div>
		);
	}
});

module.exports = FloatingAdd;

