'use strict';

var Immutable = require('immutable');
var React = require('react');

var EditActivity = require('./Edit.jsx');

var fieldTypesToRenderMethods = {
	'select_one': 'renderDatum',
	'select_multiple': 'renderData',
	'relation': 'renderRelation'
};

var log = require('../../lib/Log.js');

var ViewActivity = React.createClass({
	
	

	propTypes: {
		schema: React.PropTypes.object.isRequired, //plain old js object
		data: React.PropTypes.instanceOf(Immutable.Map).isRequired, //immutable.map
		getRelation: React.PropTypes.func.isRequired, //(storeName, id)=>instanceof Immutable.Map
		hideFields: React.PropTypes.array,
		editable: React.PropTypes.bool,
		editing: React.PropTypes.bool
	},
	
	getDefaultProps() {
		return {
			hideFields: [],
			editable: false,
			editing: false
		};
	},

	

	render(){
		//console.log('Rendering activity item', this.props.data.toJS());
		var data = this.props.data;
		if(this.props.editing){
			return (<div className="ViewActivity-item ViewActivity-item--editing">EDITING MODE ON (but not yet implemented!)</div>)
		}else{
			return (<div className="ViewActivity-item">
				{ this.renderItemLabel() }
				{ _(this.props.schema.fields).filter(field=>this.props.hideFields.indexOf(field.name)<0).map(this.renderField).value() }
				{this.renderNotes()}
			</div>);
		}
	},
	
	renderItemLabel(){
		//this could be a user defined label - e.g. "first seedlings emerged"
		//or it could be generated from item data - e.g. (plant[ed]) from (seed)
		var labelContent;
		if(this.props.data.label){
			labelContent = (<span className="ViewActivity-item-label-userDefined">{this.props.data.label}</span>);
		}else{
			var generatedLabel;
			if( this.props.data.name==='observation' ){
				generatedLabel = _.trunc(this.props.data.get('notes'), 30);
			}else{
				generatedLabel = this.props.data.get('name');
			}
			//this needs to be hooked into Acitivty.js and i18n to generate a meaningful label
			labelContent = (<span className="ViewActivity-item-label-generated">{generatedLabel}</span>);
		}
		
		return (<div className="ViewActivity-item-label">{labelContent}</div>);
	},
	
	renderNotes( ){
		return (
			<div className="ViewActivity-notes">
				{this.props.data.get('notes')}
			</div>
		);
	},
	
	renderField( field ){
		if( fieldTypesToRenderMethods[field.type] && this.props.data.has(field.name) ){
			return (
				<div key={field.name}>{this[fieldTypesToRenderMethods[field.type]](field)}</div>
			);
		}
	},
	
	
	renderDatum( field ){
		return (<div className="ViewActivity-item-field">
			<label className="ViewActivity-item-label">{field.label} </label>
			<span className="ViewActivity-item-value">{this.props.data.get(field.name)}</span>
		</div>);
	},
	
	renderData( field ){
		return (<span>{field.name} rendering not implemented yet!</span>);
	},
	
	renderRelation( field ){
		var relation = this.props.getRelation( this.props.data.get( field.name ) );
		var renderedRelation = this.props.renderRelation( this.props.data.get( field.name ) );
		if(relation){
			return (
				<div className="ViewActivity-item-field">
					<label className="ViewActivity-item-label">{field.label} </label>
					<span className="ViewActivity-item-value">{renderedRelation}</span>
				</div>
			);
		}else{
			log('Error! Relation missing', field);
			return (<span>Error! Relation missing.</span>);
		}
	}

});

module.exports = ViewActivity;