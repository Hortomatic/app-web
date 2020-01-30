'use strict';

var _ = require('lodash');
var Immutable = require('immutable');
var React = require('react');
var Morearty = require('morearty');
var moment = require('moment');
var Router = require('react-router');

var {Text, Dropdown, Pills, DatePicker, Sheet} = require('../Fatty.js');

require('./demo.css');

var Demo = React.createClass({

	getInitialState(){
		return {
			dropdownOne: undefined
		,	dropdownTwo: 'twotwo'
		
		,	dropdownThree: undefined
		,	dropdownFour: []
		
		,	dateOne: undefined
		,	dateTwo: new Date()
		,	dateThree: new Date()
		,	dateFour: undefined
		
		,	pillsOne: []
		,	pillsTwo: 2
		,	pillsThree: []
		,	pillsFour: [2,3]
		}
	},
	
	render(){
		var mainStyle = {
			display: 'flex',
			flex: '1',
			overflowY:'scroll'
		};
	
		var hint = "A short hint or example";
		var help = "This is a some text to help the user understand the use of this field, provide examples of data input etc.";
	
		var dropdownData = [{value:10, text:"Primeiro é uma"}, {value:'twotwo', text:"Segundo é Duas"}, {value:30, text:"Pois tres, claro"}];
		var pillsData = [{value:1, text:"Um"}, {value:2, text:"Dous"}, {value:3, text:"Tres"}, {value:4, text:"Catro"}];
		
		return (
			<div style={mainStyle} className="FattyDemo">
			
				{/* //Text */}
				<div style={{flex:'1 0 50%', padding:'0 2em 4em'}}>
				 	<Sheet>
				 		<h4 id="text">Single-Line Text</h4>
					 	<Text placeholder="Without Label; Placeholder" />
					 	<Text label="Single Line Text" />
					 	<Text label="With Hint" hint={hint} />
					 	<Text label="With Help" help={help} />
					 	<Text label="With Both" hint={hint} help={help} />
					 	<Text label="With Prefilled Text" value="This has help but no hint" help={help} />
					 	
					 	<h4 id="text">Multi-Line Text</h4>
					 	<Text label="Multi Line Text" hint={hint} multiline={true} />
					 	<Text label="Multi Prefilled Text" hint={hint} multiline={true} value={_.repeat('This is some text. It\'s going to repeat a few times to fill up this box.', 10)} initialHeight={50} maxHeight={500} />
						<Text label="Multi Autogrow Text" hint={hint} multiline={true} autogrow={true} initialHeight={50} maxHeight={500} />

				 	</Sheet>
				</div>
				
				{/* //Dropdown */}
				<div style={{flex:'1 0 50%', padding:'0 2em 4em'}}>
					<Sheet>
						<h4 id="dropdown">Single Dropdown</h4>
						<Dropdown data={dropdownData} onChange={v=>this.setState({dropdownOne:v})} value={this.state.dropdownOne} valueField="value" textField="text" placeholder="Without Label; Placeholder" />
						<Dropdown label="Single Select Dropdown" hint={hint} data={dropdownData} onChange={v=>this.setState({dropdownOne:v})} value={this.state.dropdownOne} valueField="value" textField="text" />
						<Dropdown label="Predefined Value" help={help} data={dropdownData} onChange={v=>this.setState({dropdownTwo:v})} value={this.state.dropdownTwo} valueField="value" textField="text" />
						<Dropdown label="Lots and Lots of Options" hint={hint} data={_.range(1,100).map(num=>({value:num, text:"Option #"+num}))} onChange={v=>this.setState({dropdownThree:v})} value={this.state.dropdownThree} valueField="value" textField="text" />
						
						<h4 id="dropdown">Multiple Dropdown</h4>
						<Dropdown label="Mutliple Select" multiple={true} hint={hint} data={_.range(1,100).map(num=>({value:num, text:"Option #"+num}))} onChange={v=>this.setState({dropdownFour:v})} value={this.state.dropdownFour} valueField="value" textField="text" />
						
					</Sheet>
				</div>
				
				{/* //Datepicker */}
				<div style={{flex:'1 0 50%', padding:'0 2em 4em'}}>
				<Sheet>
					<h4 id="dropdown">Date Picker</h4>
					<input type="text" value={this.state.dateOne} />
					<DatePicker label="Choose a date" date={this.state.dateOne} onChange={date=>this.setState({dateOne:date})} />
					<DatePicker label="Prefilled date" date={this.state.dateTwo} onChange={date=>this.setState({dateTwo:date})} />
					<DatePicker label="Showing day name" date={this.state.dateThree} showDayName={true} onChange={date=>this.setState({dateThree:date})} />
					<DatePicker label="Always Uncollapsed" date={this.state.dateThree} collapse={false} onChange={date=>this.setState({dateThree:date})} />

					<div style={{width:"50%"}}>
						<DatePicker label="Compact with day name" date={this.state.dateFour} showDayName={true} onChange={date=>this.setState({dateFour:date})} />
					</div>

				</Sheet>
				</div>
				
				{/* //Pills */}
				<div style={{flex:'1 0 50%', padding:'0 2em 4em'}}>
				<Sheet>
					<h4 id="dropdown">Pills</h4>

					<Pills label="Single Select, Uncontrolled" data={pillsData} />
					<Pills label="Single Select, Controlled" data={pillsData} value={this.state.pillsOne} onChange={value=>this.setState({pillsOne:value})} />
					<Pills label="Single Select, Predefined" data={pillsData} value={this.state.pillsTwo} onChange={value=>this.setState({pillsTwo:value})} />

					<Pills label="Multiple Select, Uncontrolled" multiple={true} data={pillsData} />
					<Pills label="Multiple Select, Controlled" multiple={true} data={pillsData} value={this.state.pillsThree} onChange={value=>this.setState({pillsThree:value})} />
					<Pills label="Multiple Select, Predefined" multiple={true} data={pillsData} value={this.state.pillsFour} onChange={value=>this.setState({pillsFour:value})} />
					
				</Sheet>
				</div>
			</div>	
		);
	}

});

module.exports = Demo;