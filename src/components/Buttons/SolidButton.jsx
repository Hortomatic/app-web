'use strict'

var React = require('react');
var cx = require('classnames');

var Button = React.createClass({

	propTypes: {
		color: React.PropTypes.oneOf(['white', 'yellow', 'red', 'green'])
	,	kind: React.PropTypes.oneOf(['raised', 'solid', 'subtle', 'dashed', 'text'])
	,	disabled: React.PropTypes.bool
	,	busy: React.PropTypes.bool
	,	label: React.PropTypes.string
	,	iconClass: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
	,	alignIcon: React.PropTypes.oneOf(['left', 'right'])
	,	onClick: React.PropTypes.func
	,	align: React.PropTypes.oneOf(['left', 'right'])
	},

	getDefaultProps(){
		return {
			color: 'white'
		,	kind: 'solid'
		,	disabled: false
		,	busy: false
		,	iconClass: false
		,	align: 'left'
		,	alignIcon: 'right'
		}
	},
	
	handleClick(ev){
		if(this.props.onClick && !this.props.disabled && !this.props.busy){
			this.props.onClick(ev);
		}
	},

	render(){
		var classes = cx(
			this.props.className
		, 'Button'
		,	'Button--'+this.props.color
		,	'Button--'+this.props.kind
		,	{
				'Button--disabled': this.props.disabled
			,	'Button--busy': this.props.busy
			,	'Button--withIcon': !!this.props.iconClass
			,	'Button--withIconOnLeft': !!this.props.iconClass && this.props.alignIcon!=='right'
			,	'Button--alignRight': this.props.align==='right'
			,	'Button--alignLeft': this.props.align!=='right'
			}
		);
		
		var content;
		
		
		
		if(React.Children.count(this.props.children)){
			content = this.props.children;
		}else{
			content = <span className="Button-content">
				{!this.props.label || <span className="Button-label">{this.props.label}</span>}
				{!this.props.iconClass ||<span className="Button-icon"><i className={this.props.iconClass}></i></span>}
			</span>;
		}
		return ( 
		<div className={classes} onClick={this.handleClick}>
			<div className="Button-inner">
				{content}
			</div> 
		</div>);
	}
});

module.exports = Button;

