import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import Immutable from 'immutable'
import _ from 'lodash'

import Fatty from 'components/Fatty'

export default class BaseEvent extends Component{

  static propTypes = {
    eventData: PropTypes.object.isRequired,
    l10n: PropTypes.func.isRequired,
    places: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
    plantings: PropTypes.object.isRequired
  };

  static defaultProps = {
  };

  l10n (label, data) {
    return this.props.l10n(`PlantingEventForm.${label}`, data)
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