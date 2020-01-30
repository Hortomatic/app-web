'use strict'

var Immutable = require('immutable')
var moment = require('moment')
var React = require('react')
var _ = require('lodash')

var ReactCSSTransitionGroup = require('react-addons-css-transition-group')

var SelectInput = require('./fields/SelectInput.jsx')

var fieldTypesToRenderMethods = {
	'select_one': 'renderSelectOneField',
	'select_multiple': 'renderSelectMultipleField',
	'relation': 'renderRelationField'
};

require('./Activity.css')

var EditActivity = React.createClass({

	propTypes: {
		date: React.PropTypes.instanceOf(Date),
		item: React.PropTypes.object.isRequired,
		data: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		//stores: React.PropTypes.object.isRequired,
		getOptionsForRelation: React.PropTypes.func.isRequired,
		hideFields: React.PropTypes.array,
		showSaveButton: React.PropTypes.bool,
		onChange: React.PropTypes.func.isRequired,
		onSave: React.PropTypes.func
	},
	
	getDefaultProps() {
		return {
			date: new Date(),
			hideFields: [],
			showSaveButton: true,
			onSave: ()=>{}
		};
	},
	
	/*getInitialState(){
		//generate a list of state properties from the activity item
		var keys = _(this.props.item.fields).pluck('name');
		var state = _.zipObject(keys);
		state.name = this.props.item.name;
		state.target = this.props.item.target;
		state.date = this.props.date;
		//merge in existing data if present
		if(this.props.data){
			state = _.merge(state, this.props.data.toJS());
		}
		return state;
	},*/
	
	_saveClick(){
		this.props.onSave( this.props.data );
	},

	//update the state corresponding to a field value
	updateField(field, value){
		console.log('Updating field %s with value %s', field.name, value);
		data = this.props.data.set(field.name, value);
		//console.log("EDIT ACTIVITY STATE CHANGE BUBBLING ON UP YALL", data.toJS());
		this.props.onChange( data );
	},
	
	renderRelationField(field){
		var options = _(_.isArray(field.relation) ? field.relation : [field.relation])
			.map( rel=>{
				return this.props.getOptionsForRelation(rel, field, this.props.item);
			})
			.filter( list=>!_.isEmpty(list) )
			.flatten()
			.value();
		console.log('Rendering relation field %s with options', field.label, options);
		return (
			<SelectInput 
				label={field.label} 
				options={options}
				value={this.props.data.get(field.name) || undefined}
				placeholder={field.placeholder || undefined}
				onChange={value=>this.updateField(field, value)}
			/>
		);
		//.
	},
	
	renderSelectOneField(field){
		if(this.props.fieldComponents[field.name]){
			return React.createElement(this.props.fieldComponents[field.name], {
				label: field.label,
				items: field.options.map(option=>{
					return {label: option, value:option, isSelected:this.props.data.get(field.name)==option}
				}),
				onChange: (item)=>this.updateField(field, item.isSelected ? item.value : undefined)
			});
		}else{
			return (
				<div>
					<label>{field.label}</label>
					<select value={this.props.data.get(field.name) || ""} onChange={ev=>this.updateField(field, ev.target.value)}>
						<option value=""></option>
						{ field.options.map( optVal=>(<option value={optVal} key={optVal}>{optVal}</option>) ) }
					</select>
				</div>
			);
		}
	},
	
	renderTextarea( field ){
		var defaultValue = field.default || "";
		return (<textarea onChange={ev=>this.updateField(field, ev.target.value)}>{defaultValue}</textarea>);
	},
	
	
	renderNumberField(field){
		var Input = Morearty.DOM.Input;
		
		if(this.props.fieldComponents[field.name]){
			return React.createElement(this.props.fieldComponents[field.name], {
				field: field,
				onChange: (item)=>this.updateField(field, item.value)
			});
		}else{
			var unit;
			if(field.withUnit){
				//render dropdowns based on unit array
				//e.g.
				/*
				
					{
						area: (system)=>{
							units[system]
						},
						volume: (system)=>{
						
						}
						weight: (system)=>{
							
						}
						length:  (system)=>{
 						
 						}
					}
					field.withUnit.map( unit=>{ return ( 
						
						//check if user gas metric or imperial, pull values from constants file
						// [area, volume, weight, length]
						
						
						
					); } )
				*/
			}
			var defaultValue = field.default || "";
			return (
				<div>
					<label>{field.label}</label>
					<input type="number" value={defaultValue} name={field.name} onChange={ev=>this.updateField(field, ev.target.value)} />
				</div>
			);
		}
	},
	
	renderField(field){
		var show = true;
		if( field.showIf ){
			show = _.any(field.showIf, function(value, key){
				return _.indexOf(value, this.props.data.get(key)) > -1;
			}.bind(this));
		}
		if( show && fieldTypesToRenderMethods[field.type] ){
			return <div key={field.name}>{this[fieldTypesToRenderMethods[field.type]](field)}</div>
		}
	},

	render(){
		//console.log('Item from props', this.props.item);
		//console.log('Current state', this.state);
		return (<div className="EditActivity-item">
		{/*<ReactCSSTransitionGroup transitionName="example">*/}
			{ _(this.props.item.fields).filter(field=>this.props.hideFields.indexOf(field.name)<0).map(this.renderField).value() }
		{/*</ReactCSSTransitionGroup>*/}
			{this.props.showSaveButton ? (<div>
				<a className="btn" onClick={this._saveClick}>Save Action</a>
			</div>) : ('')}
		</div>);
	}

});

module.exports = EditActivity;