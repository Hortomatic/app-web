'use strict'

var React = require('react');
var TransitionGroup = require('react-addons-css-transition-group');
var cx = require('classnames');
var uncontrollable = require('uncontrollable');

require('./IconButton.css');

var iconClasses = {
	'edit': 'fa fa-pencil'
,	'trash': 'fa fa-trash'
, 'ok': 'fa fa-check'
, 'save': 'fa fa-check'
, 'close': 'fa fa-close'
, 'cancel': 'fa fa-close'
,	'undo': 'fa fa-undo'
};

var IconButton = React.createClass({

	propTypes: {
		color: React.PropTypes.oneOf(['white', 'yellow'])
	,	style: React.PropTypes.oneOf(['solid', 'subtle', 'dashed'])
	, size: React.PropTypes.oneOf(['tiny', 'small', 'medium', 'big', 'mega'])
	,	disabled: React.PropTypes.bool
	,	busy: React.PropTypes.bool
	, active: React.PropTypes.bool
	,	label: React.PropTypes.string
	, showLabel: React.PropTypes.bool
	,	icon: React.PropTypes.string
	,	labelPosition: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
	, tabIndex: React.PropTypes.number
	,	onClick: React.PropTypes.func
	,	onFocus: React.PropTypes.func
	,	onHover: React.PropTypes.func
	}

,	getDefaultProps(){
		return {
			color: 'white'
		,	style: 'solid'
		,	size: 'medium'
		,	disabled: false
		, active: false
		,	busy: false
		, showLabel: false
		,	iconClass: false
		,	labelPosition: 'top'
		, tabIndex: 0
		}
	}

,	handleClick(ev){
		if(this.props.onClick && !this.props.disabled && !this.props.busy){
			this.props.onClick(ev);
		}
	}

,	handleFocus(ev){
		this.props.onToggleLabel(true);
	}

,	handleBlur(ev){
		this.props.onToggleLabel(false);
	}

,	handleMouseEnter(ev){
		this.props.onToggleLabel(true);
	}

,	handleMouseLeave(ev){
		this.props.onToggleLabel(false);
	}

,	render(){
		var classes = cx(
			this.props.className
		, 'IconButton'
		,	'IconButton--'+this.props.color
		,	'IconButton--'+this.props.style
		,	'IconButton--'+this.props.size
		,	'IconButton--'+this.props.labelPosition+'Label'
		,	{
				'IconButton--disabled': this.props.disabled
			,	'IconButton--busy': this.props.busy
			,	'IconButton--active': this.props.active
			}
		);

		var content, label;

		if(React.Children.count(this.props.children)){
			content = this.props.children;
		}else{
			label = this.props.label && this.props.showLabel
				? <span className="IconButton-label" key="label">{this.props.label}</span>
				: null
			;
			content = <span className="IconButton-content">
				<span className="IconButton-icon"><i className={iconClasses[this.props.icon]} /></span>
			</span>;
		}
		return ( 
			<div className={classes} >
				<div 
				className="IconButton-Target"
				onClick={this.handleClick}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				tabIndex={this.props.tabIndex}>
					{content}
				</div>
				{/*<TransitionGroup transitionName="IconButton-LabelTransition">*/}
					{label}
				{/*</TransitionGroup>*/}
			</div> 
		);
	}
});

module.exports = uncontrollable(IconButton, {showLabel: 'onToggleLabel'});

