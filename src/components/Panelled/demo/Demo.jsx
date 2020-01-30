'use strict';

var React = require('react');

import Panelled, {Panel, Tab, TabSpacer} from '../Panelled.jsx';

const demoTabComponent = React.createClass({
	render() {
		return (
			<div>TAB TAB</div>
		);
	}
});


var Demo = React.createClass({

	render(){
		return (<div style={{
			flex:1, 
			display:'flex', 
			flexDirection:'column'
		}}>
			<Panelled theme="cream">
				<Panel label="Tab One" icon={<i className="fa fa-plus" />}>
					Content of Panel 1
				</Panel>
				<Panel label="Tab Two" icon={<i className="fa fa-smile-o" />}>
					Content of Sheeeeet Two.
				</Panel>
				<Panel tabComponent={demoTabComponent} >
					Content of Panel Three.
				</Panel>
				<TabSpacer />
				<Panel icon={<i className="fa fa-smile-o" />}>
					Content of an icon tabbed sheet
				</Panel>
				<Tab label="Lolocopter" style={{}} onClick={console.log('Tab Clik')} />
			</Panelled>
		</div>);
	}

});

module.exports = Demo;