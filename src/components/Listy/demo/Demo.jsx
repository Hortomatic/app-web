'use strict';

import React from 'react';
import Immutable from 'immutable';
import _ from 'lodash';

import Listy from '../Listy';

const demoData = Immutable.fromJS(require('data/growstuff-crops.json'));

const filterOptions = Immutable.fromJS([
	{
		name: 'shade'
	,	label: 'Shade preference'
	,	values: demoData.reduce((list, item)=>(
			list.find(exst=>exst.get('name')===item.get('shade'))
				? list
				: list.push(Immutable.Map({name: item.get('shade'), label:item.get('shade').toUpperCase()}))  
			)
		, Immutable.List()) 
	}
,	{
		name: 'plant_from'
	, label:'Plant from'
	, values:demoData.reduce((list, item)=>(
			list.find(exst=>exst.get('name')===item.get('plant_from'))
				? list
				: list.push(Immutable.Map({name: item.get('plant_from'), label:item.get('plant_from').toUpperCase()})) 
			)
		, Immutable.List())
	}
]);

const filterFunction = (item, filters)=>{
	//console.log('Filtering item with filters', item, filters.toJS ? filters.toJS() : filters);
	return filters.every(filter=>{
		if(!filter.get('filterName'))
			return false;
		if(!filter.get('valueName'))
			return true;
		return item.get(filter.get('filterName'))===filter.get('valueName');
	})
};

const DemoItemComponent = React.createClass({
	displayName: "ListyDemoItem"

,	render() {
		console.log('%i', this.props.i, this.props.item.get('name'));
		return (
			<div style={{padding:'5px 10px', height:65}}>
				<div style={{fontSize:22, fontWeight:700}}>{this.props.item.get('name')}</div>
				<div>{this.props.item.get('scientific')}</div>
			</div>
		);
	}
});


const Demo = React.createClass({
	displayName: "ListyDemo"

,	getInitialState(){
		return {
			filterValues: Immutable.List()
		}
	}

,	render(){
		return (<div style={{
			flex:1, 
			display:'flex', 
			flexDirection:'column'
		}}>
			<Listy 
			data={demoData}
			itemRenderer={ (i, props)=><DemoItemComponent {...props} i={i} />}
			itemHeight={65}
			searchFunction={(itm, string)=>itm.get('name').match(string) || itm.get('scientific').match(string)}
			filterOptions={filterOptions}
			filterFunction={filterFunction}
			filterValues={this.state.filterValues}
			onFilterChange={filters=>{console.log('Filters change', filters.toJS()); this.setState({filterValues: filters})}}
			filters={Immutable.List([
				{
					label: 'Full Sun'
				,	filter: item=>item.get('shade')==='sun'
				}
			,	{
					label: 'Semi-Shade'
				,	filter: item=>item.get('shade')==='semi-shade'
				}
			,	{
					label: 'Unspecified'
				,	filter: item=>item && !item.get('shade')
				}
			])} />
		</div>);
	}

});

module.exports = Demo;