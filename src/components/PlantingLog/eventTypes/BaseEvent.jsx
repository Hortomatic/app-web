import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import View, { Cover } from 'components/View'
import Immutable from 'immutable'
import _ from 'lodash'

import Fatty from 'components/Fatty'

export const baseStyles = StyleSheet.create({
  text: {
    color: '#FFF'
  },
  notes: {
    fontSize: 12,
    fontWeight: 500
  }
})

export default class BaseEvent extends Component{

  static propTypes = {
    eventData: PropTypes.object.isRequired,
    l10n: PropTypes.func.isRequired
  };

  static defaultProps = {
  };

  l10n (label, data) {
    return this.props.l10n(`PlantingLogEvent.${label}`, data)
  }

  updateField (field, value) {
    this.props.onChange({...this.props.eventData, ...{field: value}})
  }

  render () {
    return (
      <View style={{}}>

      </View>
    )
  }

}
