import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {StyleSheet} from 'react-native-web'
import _ from 'lodash'
import translate from 'counterpart'

import {Cover, Col, Row} from 'components/View'
import {EditEvent} from 'components/PlantingEventForm'

import {SAVING, SAVED, FAILED} from 'constants/status'
import {
  actions as plantingsActions,
  selector as plantingsSelector
} from 'redux/modules/plantings'
import {
  actions as editEventUIActions,
  selector
} from 'redux/modules/editEventUI'

import {getPlanting, getEventAtIndex} from 'utils/plantings'

const l10n = {
  'PlantingEventForm.DatePickerLabel': 'Date',
  'PlantingEventForm.EventNameLabel': 'Event Name',
  'PlantingEventForm.EventNameHint': ' ',
  'PlantingEventForm.NotesLabel': 'Notes',
  'PlantingEventForm.CancelButton': 'Cancel',
  'PlantingEventForm.SaveButton': 'Save',

  'PlantingEventForm.Event.Plant.Material.Seed': 'Seed',
  'PlantingEventForm.Event.Plant.Material.Plantlet': 'Plantlet',
  'PlantingEventForm.Event.Plant.Material.Cutting': 'Cutting',
  'PlantingEventForm.Event.Plant.Material.Tuber': 'Tuber',
  'PlantingEventForm.Event.Plant.Recipient.Earth': 'Earth',
  'PlantingEventForm.Event.Plant.Recipient.Tray': 'Tray',
  'PlantingEventForm.Event.Plant.Recipient.Modules': 'Modules',
  'PlantingEventForm.Event.Plant.Recipient.Pots': 'Pots',
  'PlantingEventForm.Event.Plant.Recipient.Other': 'Other',
  'PlantingEventForm.Event.Plant.PlaceLabel': 'Grow Space',
  'PlantingEventForm.Event.Plant.PlaceHint': '',
  'PlantingEventForm.Event.Plant.FromLabel': 'Planting Material',
  'PlantingEventForm.Event.Plant.FromHint': '',
  'PlantingEventForm.Event.Plant.RecipientLabel': 'Planting Medium',
  'PlantingEventForm.Event.Plant.RecipientHint': '',

  'PlantingEventForm.Event.Transplant.Recipient.Earth': 'Earth',
  'PlantingEventForm.Event.Transplant.Recipient.Tray': 'Tray',
  'PlantingEventForm.Event.Transplant.Recipient.Modules': 'Modules',
  'PlantingEventForm.Event.Transplant.Recipient.Pots': 'Pots',
  'PlantingEventForm.Event.Transplant.Recipient.Other': 'Other',
  'PlantingEventForm.Event.Transplant.PlaceLabel': 'Grow Space',
  'PlantingEventForm.Event.Transplant.PlaceHint': '',
  'PlantingEventForm.Event.Transplant.RecipientLabel': 'Planting Medium',
  'PlantingEventForm.Event.Transplant.RecipientHint': '',
}
translate.setSeparator('*')
translate.registerTranslations('en', l10n)

export class EditEventUI extends Component {

  static propTypes = {
    state: PropTypes.object.isRequired,
    planting: PropTypes.object.isRequired,
    plantingId: PropTypes.string.isRequired,
    eventIndex: PropTypes.number.isRequired,
    eventData: PropTypes.object.isRequired
  };

  // TODO move l10n into store
  l10n (key, data) {
    if (!l10n[key]) {
      return `No l10n for key ${key}`
    }
    return translate(key, data)
  }

  handleEventDataChange = (eventData) => {
    const {
      plantingId,
      eventIndex
    } = this.props
    this.props.editEvent({
      plantingId: plantingId,
      eventIndex: eventIndex,
      eventData
    })
  };

  handleEventUISave = () => {
    const {
      plantingId,
      eventIndex,
      eventData
    } = this.props
    this.props.saveEvent({
      plantingId: plantingId,
      eventIndex: eventIndex,
      eventData
    })
  };

  handleEventUICancel = () => {
    this.props.hideEditEventUI()
  };

  render () {
    const {state, eventData} = this.props

    if (!state.isOpen || !eventData) {
      return null
    }

    return (
      <Col style={{flexShrink:0, flexBasis:480}}>
        <EditEvent
          l10n={(key, data) => this.l10n(`PlantingEventForm.${key}`, data)}
          onChange={this.handleEventDataChange}
          onCancel={this.handleEventUICancel}
          onSave={this.handleEventUISave}
          isSaving={state.saveStatus===SAVING}
          isSaved={state.saveStatus===SAVED}
          eventData={eventData}
        />
      </Col>
    )
  }
}

export default connect(selector, editEventUIActions)(EditEventUI)
