'use strict';

var React = require('react');
var Immutable = require('immutable');
var cx = require('classnames');
var _ = require('lodash');
var TransitionGroup = require('react-addons-css-transition-group');
var {UniformList} = require('react-list');

var AppContext = require('Context');

var ListSheet = React.createClass({

	mixins: [
		AppContext.Mixin
	],
	
	propTypes: {
		selectedItems: React.PropTypes.array,
		isActive: React.PropTypes.bool,
		onItemClick: React.PropTypes.func
	},

	getDefaultProps(){
		return {
			isActive: false,
			onItemClick: ()=>{},
			selectedItems: []
		};
	},
	
	handleItemClick(itemKey, payload){
		this.props.onItemClick(itemKey, payload);
	},

	render(){

		var children;

		if(React.Children.count(this.props.children)){
			children = React.Children.map(this.props.children, function(child, index){
				if(React.isValidElement(child)){
					//console.log('ListItem props are ', Object.freeze(child.props), child.key);
					var childProps = child.props;
					//if(child.props.key)
					childProps.key = child.key || index;
						
					childProps.onClick = ev=>this.handleItemClick(childProps.key, childProps.payload);
					childProps.isSelected = this.props.selectedItems.indexOf(childProps.key) > -1;
					
					return React.addons.cloneWithProps(child, childProps);
				}
			}, this);
		}else{
			if(this.props.itemRenderer && (this.props.length || this.props.data) ){
				let length = this.props.length 
				|| (this.props.data instanceof Immutable.Iterable)
					? this.props.data.count()
					: this.props.data.length
				;

				//item renderer gets passed an index,
				//a click handler to trigger
				//and a function to call with it's key to see if it's selected
				let itemRenderer = (i)=>(
					this.props.itemRenderer(i, {
						onClick: this.handleItemClick
					,	isSelected: (key)=>this.props.selectedItems.indexOf(key) > -1
					})
				)

				children = <UniformList itemRenderer={itemRenderer} length={length} />;
			}
		}

		var hasItems = !!React.Children.count(children);
		var {
			data
		,	...props
		} = this.props
		return (
			<div {...props} className={cx('ListSelector-Sheet', {
				'ListSelector-Sheet--isActive': this.props.isActive
			,	'ListSelector-Sheet--empty': !hasItems
			})}>
				<TransitionGroup component="div" transitionName="ListSelector-transitions-itemSlideDown">
					{hasItems
						?	children
						: <div className="ListSelector-Sheet-emptyMessage">{this.l10n('ListSelector-Sheet-empty', {searchText:this.props.searchText})}</div>
					}
				</TransitionGroup>
			</div>
		);
	}

});

module.exports = ListSheet;