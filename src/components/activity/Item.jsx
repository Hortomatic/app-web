'use strict';

var Immutable = require('immutable');
var React = require('react');

var ActivityItem = React.createClass({
	
	propTypes: {
		item: React.PropTypes.instanceOf(Immutable.Map).isRequired
	},
	
	render(){
		console.log('Rendering activity item', this.props.item.toJS());
		var item = this.props.item;
		return (<div>
			Action Name: {item.get('name')}<br/>
			Action Target: {item.get('target')}
		</div>);
	}
	
});

module.exports = ActivityItem;