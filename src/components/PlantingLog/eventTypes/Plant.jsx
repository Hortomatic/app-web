import React from 'react'
import {StyleSheet} from 'react-native-web'
import {View, Text} from 'components/View'

import BaseEvent, {baseStyles} from './BaseEvent'

const styles = StyleSheet.create({

})

export default class PlantEvent extends BaseEvent {

  render () {
    const {eventData} = this.props

    const plantFromOptions = [
      {value: 'seed', text: this.props.l10n('Plant.Material.Seed')},
      {value: 'plantlet', text: this.props.l10n('Plant.Material.Plantlet')},
      {value: 'cutting', text: this.props.l10n('Plant.Material.Cutting')},
      {value: 'tuber', text: this.props.l10n('Plant.Material.Tuber')}
    ]

    const recipientOptions = [
      {value: 'earth', text: this.props.l10n('Plant.Recipient.Earth')},
      {value: 'tray', text: this.props.l10n('Plant.Recipient.Tray')},
      {value: 'modules', text: this.props.l10n('Plant.Recipient.Modules')},
      {value: 'pot', text: this.props.l10n('Plant.Recipient.Pots')},
      {value: 'other', text: this.props.l10n('Plant.Recipient.Other')}
    ]

    return (
      <View>
        <Text style={{...baseStyles.text}}>Planted in {eventData.placeName}</Text>
        <Text style={{...baseStyles.text}}>Seed Material: {eventData.from}</Text>
        <Text style={{...baseStyles.text}}>Planting Environment: {eventData.recipient}</Text>
        <Text style={{...baseStyles.text, ...baseStyles.notes}}>{eventData.notes}</Text>
      </View>
    )
  }

}
