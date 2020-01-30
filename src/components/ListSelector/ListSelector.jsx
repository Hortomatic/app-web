'use strict';

var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var uncontrollable = require('uncontrollable');

var ListItem = require('./ListItem.jsx');
var ListSheet = require('./ListSheet.jsx');

require('./ListSelector.css');


var ListSelector = React.createClass({
	
	displayName: 'ListSelector',
	
	propTypes: {
		mutliple: React.PropTypes.bool,
		maintainItemSelection: React.PropTypes.bool,
		selectedItems: React.PropTypes.array,
		
		showSearchButton: React.PropTypes.bool,
		showSearchPanel: React.PropTypes.bool,
		onSearchClick: React.PropTypes.func,
		onSearchToggle: React.PropTypes.func,
		onSearchChange: React.PropTypes.func,

		showAddButton: React.PropTypes.bool,
		onAddClick: React.PropTypes.func,


		//fires with full selected state
		onChange: React.PropTypes.func,
		//fires with just the clicked item
		onItemClick: React.PropTypes.func,
		theme: React.PropTypes.string
	},
	
	getInitialState(){
		return {
			search: '',
			activeSheetIndex: 0,
			selectedItems: this.props.selectedItems
		};
	},
	
	getDefaultProps(){
		return {
			onChange: ()=>{},
			onItemClick: ()=>{},
			multiple: false,
			maintainItemSelection: true,
			selectedItems: [],
			showSearchPanel: false,
			showSearchButton: false,
			showAddButton: false,
			onAdd: ()=>{},
			onSearch: ()=>{},
			onSearchClick: ()=>{},
			theme: 'green'
		};
	},
	
	componentWillReceiveProps(nextProps) {
		var direction;
	
		/*if (nextProps.selectedDate !== this.props.selectedDate) {
			direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
			this.setState({
				transitionDirection: direction
			});
		}*/
	},

	componentDidUpdate(oldProps){
		if(oldProps.showSearchPanel===false && this.props.showSearchPanel===true){
			this.refs.searchInput.focus();
		}
	},
	
	changeSheet(newIndex, ev){
		var prevIndex = this.state.activeSheetIndex;
		this.setState({
			previousActiveSheetIndex: prevIndex,
			activeSheetIndex: newIndex
		});
	},

	handleSearchButtonClick( ev ){
		this.props.onSearchClick( ev, this.props.showSearchPanel );
		//wipe value on close
		if(this.props.showSearchPanel){
			this.setState({search: ''});
			this.props.onSearchChange('');
		}
		this.props.onSearchToggle( !this.props.showSearchPanel );
	},

	handleSearchChange(ev){
		this.setState({search: ev.target.value});
		this.props.onSearchChange(ev.target.value);
	},

	
	handleItemClick(itemKey, payload){
		var selected;
		if(this.props.multiple){
			selected = _.clone(this.state.selectedItems);
			if(selected.indexOf(itemKey) > -1){
				selected.splice( selected.indexOf(itemKey), 1);
			}else{
				selected.push(itemKey);
			}
		}else{
			selected = (this.state.selectedItems[0] === itemKey) ? [] : [itemKey];
		}
		
		if(this.props.maintainItemSelection===true){		
			this.setState({
				selectedItems: selected
			})
		}
		this.props.onChange( selected );
		this.props.onItemClick( itemKey, payload );
	},
	
	render(){

		var classes = ['ListSelector'];
		classes.push( this.props.className );
		classes.push( 'ListSelector--'+this.props.theme);
		//classes.push( 'ListSelector--transitionsOff');
		
		var searchItems = '';
		
		var prevSheet;
		
		var sheets = React.Children.map(this.props.children, (child, index) => {
			var childProps = {};
			
			if(childProps.isActive)
				prevSheet = index;
			childProps.isActive = (this.state.activeSheetIndex === index);

			childProps.searchText = this.state.search || '';

			childProps.style = {
				transform:'translate('+(100*(index-this.state.activeSheetIndex))+'%,0)'
			,	WebkitTransform: 'translate('+(100*(index-this.state.activeSheetIndex))+'%,0)'
			,	MozTransform: 'translate('+(100*(index-this.state.activeSheetIndex))+'%,0)'
			};			
			
			childProps.onItemClick = this.handleItemClick;
			childProps.selectedItems = this.state.selectedItems;
			return React.addons.cloneWithProps(child, childProps);
		}, this);
				
		return (
		<div className={classes.join(' ')}>
			{this.renderTabs(sheets)}
			{this.renderSearchPanel()}
			<div className="ListSelector-Sheets">
				{sheets}
				<ListSheet icon="search" name="search">
					{searchItems}
				</ListSheet>
			</div>
		</div>);
	},
	
	sheetHasItems(sheet){
		return sheet.props.data 
			?	!!sheet.props.data.length
			: !!React.Children.count(sheet.props.children)
		;
	},

	renderTabs(sheets){
		var tabs = [];
		React.Children.forEach(sheets, (child) => {
			if(child.type === ListSheet){
				tabs.push({
					name: child.props.name
				,	icon: child.props.icon
				,	isActive: child.props.isActive
				,	isEmpty: !this.sheetHasItems(child)
				});
			}
		});
		var renderedTabs = tabs.map( (tab, index)=>{

			return (<div className={cx(
				"ListSelector-TabBar-Tab"
			,	{
					'ListSelector-TabBar-Tab--active': tab.isActive
				,	'ListSelector-TabBar-Tab--empty': tab.isEmpty
				}
			)} key={index} onClick={this.changeSheet.bind(this, index)}>{tab.name}</div>);
		});
		
		var searchButton, addButton;
		
		if(this.props.showSearchButton){
			searchButton = (
			<div className={cx("ListSelector-TabBar-button",  "ListSelector-TabBar-button-search",{
				"ListSelector-TabBar-button--active": this.props.showSearchPanel
			})} 
			onClick={this.handleSearchButtonClick}>
				<span className="fa fa-search"></span>
			</div>);
		}
		if(this.props.showAddButton){
			addButton = (<div className="ListSelector-TabBar-button ListSelector-TabBar-button-add" onClick={this.props.onAddClick}><span className="fa fa-plus"></span></div>);
		}
		
		return (
			<div className="ListSelector-TabBar">
				{renderedTabs}
				<div className="ListSelector-TabBar-buttons">
					{searchButton}
					{addButton}
				</div>
			</div>
		);
	},

	renderSearchPanel(){
		return (
			<div className={cx("ListSelector-SearchPanel", {
				"ListSelector-SearchPanel--active": this.props.showSearchPanel
			})}>
				<input 
				className="ListSelector-SearchPanel-input"
				value={this.state.search} 
				ref="searchInput"
				onChange={this.handleSearchChange} />
			</div>
		);
	}
	
});



module.exports = uncontrollable(ListSelector, {'showSearchPanel': 'onSearchToggle'});