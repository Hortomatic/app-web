'use strict';

const React = require('react');
const Immutable = require('immutable');
const cx = require('classnames')
const _ = require('lodash');
const uncontrollable = require('uncontrollable');

//import {Dropdown, Text} from 'Fatty/Fatty';

var {DropdownList} = require('react-widgets');

require('./Filter.css');

const Filter = uncontrollable(React.createClass({

	displayName: 'Filter',
	
	propTypes: {
		onChange: React.PropTypes.func
	,	onRemove: React.PropTypes.func
	,	fields: React.PropTypes.array.isRequired
	,	filter: React.PropTypes.instanceOf(Immutable.Map).isRequired
	}

,	getDefaultProps(){
		return {
			filter: Immutable.Map({filterName: undefined, valueName: undefined})
		};
	}
	
,	_propertyChange( property ){
		this.props.onChange(this.props.filter.set('filterName', property.get('name')));
	}

,	_valueChange( value ){
		this.props.onChange(this.props.filter.set('valueName', value.get('name')));
	}

,	render(){
		var currentFilter = this.props.filter.get('filterName') 
			? this.props.fields.find(field=>field.get('name')===this.props.filter.get('filterName'))
			: undefined
		;
		console.log('currentFilter is ', currentFilter && currentFilter.toJS());
		var currentValue = currentFilter
			? currentFilter.get('values').find(v=>{
					return v.get('name')===this.props.filter.get('valueName');
				})
			: undefined
		;
		return (
			<div 
			className={cx('Listy-Filter', {})} 
			onClick={this.handleClick}>
				<div className="Listy-Filter-fields">
					<div className="Listy-Filter-property">
						<DropdownList 
						placeholder="..."
						data={ this.props.fields}
						value={ currentFilter } 
						textField={item=>item.get('label')}
						onChange={this._propertyChange}  />
					</div>
					<div className="Listy-Filter-value">
						<DropdownList 
						placeholder="..."
						data={ currentFilter && currentFilter.get('values').toArray() }
						value={ currentValue }
						textField={item=>item.get('label')}
						onChange={this._valueChange}  />
					</div>
					{this.props.onRemove 
						? <div className="Listy-Filter-remove">
								<i className="fa fa-close" onClick={this.props.onRemove} />
							</div>
						: <div style={{flex:'0 0 35px'}} />
					}
				</div>
			</div>);
	}

}),
	{filter: 'onChange'}
);



export default Filter;

