import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import Immutable from 'immutable'
import _ from 'lodash'

import Fatty from 'components/Fatty'

import BaseEvent from './BaseEvent'

export default class GenericEvent extends BaseEvent{
	
	render () {
		const {eventData} = this.props;
		return (
			<View></View>	
		)
	}

}