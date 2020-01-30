'use strict';

var _ = require('lodash');
var Immutable = require('immutable');
var React = require('react');


var {IconButton} = require('../Button');

//require('./demo.css');

var Demo = React.createClass({

	getInitialState(){
		return {
			dropdownOne: undefined
		,	dropdownTwo: 'twotwo'

		}
	},
	
	render(){
		var mainStyle = {
			display: 'flex',
			flex: '1',
			overflowY:'scroll'
		};

		return (
			<div style={mainStyle} className="FattyDemo">
			
				{/* //Icon Buttons */}
				<div style={{flex:'1 0 100%', padding:'0 2em 4em', background:'#fff'}}>
				 	<h3 id="regular" style={{marginBottom:100}}>IconButton</h3>

				 	<IconButton icon="ok" />
				 	<br /><br /><br />
				 	<IconButton icon="ok" showLabel={true} label="This is the label for the button. It should show on hover or focus" />
				 	<br /><br /><br />
				 	<IconButton icon="ok" labelPosition="left" label="This is the label for the button. It should show on hover or focus" />
				 	<br /><br /><br />
				 	<IconButton icon="ok" labelPosition="right" label="This is the label for the button. It should show on hover or focus" />
				 	<br /><br /><br />
				 	<IconButton icon="ok" labelPosition="bottom" label="This is the label for the button. It should show on hover or focus" />
					 	
				</div>

				
			</div>	
		);
	}

});

module.exports = Demo;