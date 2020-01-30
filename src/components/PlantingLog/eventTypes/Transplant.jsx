import React from 'react'
import {StyleSheet} from 'react-native-web'
import {View, Text} from 'components/View'

import BaseEvent, {baseStyles} from './BaseEvent'

const styles = StyleSheet.create({

})

export default class TransplantEvent extends BaseEvent {

  render () {
    const {eventData} = this.props

    const recipientLabels = {
      earth: this.props.l10n('Plant.Recipient.Earth'),
      tray: this.props.l10n('Plant.Recipient.Tray'),
      modules: this.props.l10n('Plant.Recipient.Modules'),
      pot: this.props.l10n('Plant.Recipient.Pots'),
      other: this.props.l10n('Plant.Recipient.Other')
    }

    return (
      <View>
        <Text style={{...baseStyles.text}}>Transplant to {eventData.placeName}</Text>
        <Text style={{...baseStyles.text}}>{recipientLabels[eventData.recipient]}</Text>
        <Text style={{...baseStyles.text, ...baseStyles.notes}}>{eventData.notes}</Text>
      </View>
    )
  }

}
