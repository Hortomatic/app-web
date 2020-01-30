import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import _ from 'lodash'

import Fatty from 'components/Fatty'

import BaseEvent from './BaseEvent'

export default class PlantEvent extends BaseEvent{

	render(){
		const {eventData, places} = this.props

		const placeNames = places.map(place=>{
			return {value: place.id, text: place.name}
		})

		var plantFromOptions = [
			{value: 'seed', text: this.props.l10n('Plant.Material.Seed')},
			{value: 'plantlet', text: this.props.l10n('Plant.Material.Plantlet')},
			{value: 'cutting', text: this.props.l10n('Plant.Material.Cutting')},
			{value: 'tuber', text: this.props.l10n('Plant.Material.Tuber')}
		];

		var recipientOptions = [
			{value: 'earth', text: this.props.l10n('Plant.Recipient.Earth')},
			{value: 'tray', text: this.props.l10n('Plant.Recipient.Tray')},
			{value: 'modules', text: this.props.l10n('Plant.Recipient.Modules')},
			{value: 'pot', text: this.props.l10n('Plant.Recipient.Pots')},
			{value: 'other', text: this.props.l10n('Plant.Recipient.Other')}
		];

		return (<View>
			<Fatty.Dropdown
				data={ _.sortBy(placeNames, 'text') }
				label={this.props.l10n('Plant.PlaceLabel', eventDataObj)}
				hint={this.props.l10n('Plant.PlaceHint', eventDataObj)}
				value={eventData.placeId}
			onChange={item=>this.updateField('placeId', item.value)} />

			<Fatty.Pills
				data={plantFromOptions}
				label={this.props.l10n('Plant.FromLabel', eventDataObj)}
				hint={this.props.l10n('Plant.FromHint', eventDataObj)}
				value={eventData.from}
			onChange={value=>this.updateField('from', value[0])} />

			<Fatty.Pills
				data={recipientOptions}
				label={this.props.l10n('Plant.RecipientLabel', eventDataObj)}
				hint={this.props.l10n('Plant.RecipientHint', eventDataObj)}
				value={eventData.recipient}
			onChange={value=>this.updateField('recipient', value[0])} />


		</View>);
	}

}
