import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import Immutable from 'immutable'
import _ from 'lodash'

import Fatty from 'components/Fatty'

import BaseEvent from './BaseEvent'

export default class TransplantEvent extends BaseEvent{

	render () {
		const {eventData, places} = this.props

		const placeNames = places.map(place=>{
			return {value: place.id, text: place.name}
		})

		var recipientOptions = [
			{value: 'earth', text: this.props.l10n('Transplant.Recipient.Earth')},
			{value: 'tray', text: this.props.l10n('Transplant.Recipient.Tray')},
			{value: 'modules', text: this.props.l10n('Transplant.Recipient.Modules')},
			{value: 'pot', text: this.props.l10n('Transplant.Recipient.Pots')},
			{value: 'other', text: this.props.l10n('Transplant.Recipient.Other')}
		]

		return (
			<View>
				<Fatty.Dropdown
					data={ _.sortBy(placeNames, 'text') }
					label={this.props.l10n('Transplant.PlaceLabel', eventData)}
					hint={this.props.l10n('Transplant.PlaceHint', eventData)}
					value={eventData.place_id}
				onChange={item=>this.updateField('place_id', item.value)} />

				<Fatty.Pills
					data={recipientOptions}
					label={this.props.l10n('Transplant.RecipientLabel')}
					hint={this.props.l10n('Transplant.RecipientHint')}
				value={eventData.recipient}
				onChange={value=>this.updateField('recipient', value[0])}	/>
			</View>
		)
	}

}
