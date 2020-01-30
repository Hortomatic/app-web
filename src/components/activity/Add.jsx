'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');

var EditView = require('./Edit.jsx');

var AddActivity = React.createClass({

	propTypes: {
		date: React.PropTypes.instanceOf(Date),
		list: React.PropTypes.array,
		onSave: React.PropTypes.func
	},

	getInitialState(){
		return {
			itemName: undefined,
			date: this.props.date
		};
	},
	
	getDefaultProps() {
		return {
			date: new Date(),
			list: [],
			onSave: function(){}
		};
	},
	
	_onSaveItem(item){
		this.props.onSave(item);
	},
	
	chooseItemChange(ev){
		var itemName = ev.target.value;
		console.log('setting state.itemName to ', itemName);
		this.setState({
			itemName: itemName
		});
	},
	
	renderItemForm(){
		if(this.state.itemName!==undefined){
			var item = _.find(activitySchemas, {name: this.state.itemName});
			if(item){
				return (<EditView date={this.props.date} item={item} key={item.name} onSave={this._onSaveItem} />);
			}else{
				console.error('Unknown activity name: %s', this.state.itemName);
			}
		}
	},

	render(){
		//console.log('re-rendering add activity view');
		return (<div>
			<select onChange={this.chooseItemChange}>
				<option key="empty" value=""></option>
				{_.map(activitySchemas, item=>(<option value={item.name} key={item.name}>{item.name}</option>) )};
			</select>
			{this.renderItemForm()}
		</div>);
	}

});

module.exports = AddActivity;