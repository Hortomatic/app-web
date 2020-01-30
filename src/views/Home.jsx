'use strict';

import React from 'react'
import View, { Cover } from 'components/View'

require('./Home.css')

let Home = React.createClass({

	render(){
		return (
			<Cover className="Home App-mainView">
				<object
				height={310}
				width={260}
				data={require('static/gnome.svg')}
				type="image/svg+xml"
				className="Home-Gnome" />

			  <div className="Home-Bubble Home-IntroBubble">
				  <div className="Home-Bubble-content">
				  	<h1 className="Home-Bubble-Title Home-IntroBubble-Title">Woo! Empty dashboard!</h1>
				  	<p className="primary">Sweet dashboard, bro. Such yellow. Much logo.</p>
				  	<p>Ok, ok. There will be a lovely dashboard here one day. For now click something in the menu above.</p>
				  </div>
				</div>
			</Cover>
		);
	}

});

export default Home