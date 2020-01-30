'use strict';

import React from 'react';
import Immutable from 'immutable'
import cx from 'classnames';
import _ from 'lodash';

require('./Item.css');

const Item = React.createClass({

	displayName: 'Item'
	
,	propTypes: {
		isSelected: React.PropTypes.bool
	,	onSelect: React.PropTypes.func
	}

,	getDefaultProps(){
		return {
			isSelected: false,
			onClick: ()=>{} 
		};
	}
	
,	_click( ev ){
		this.props.onSelect();
	}

,	render(){	
		return (
			<div className={cx('Listy-Item', this.props.className, 
				{'Listy-Item--selected':this.props.isSelected}
			)} onClick={this._click}>
				{this.props.children}
			</div>);
	}

});

module.exports = Item;