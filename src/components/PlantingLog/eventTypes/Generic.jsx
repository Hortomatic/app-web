import React, {Component, PropTypes} from 'react'
import View, { Cover, Text } from 'components/View'
import _ from 'lodash'

import BaseEvent, {baseStyles} from './BaseEvent'

export default class GenericEvent extends BaseEvent{

  render () {
    const {eventData} = this.props;
    return (
      <View>
        <Text style={baseStyles.text}>
          {eventData.activityType || eventData.lifecycleStage}
        </Text>
        <Text style={{...baseStyles.text, ...baseStyles.notes}}>{eventData.notes}</Text>
      </View>
    )
  }

}
