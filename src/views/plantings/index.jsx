import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'
import translate from 'counterpart'

import {SAVING, SAVED, FAILED} from 'constants/status'
import {Cover} from 'components/View'
import PlantingList from 'components/PlantingList'
import PlantingLog from 'components/PlantingLog'

import {actions as plantingsActions } from '../../redux/modules/plantings'
import {actions as editEventUIActions } from '../../redux/modules/editEventUI'
import {selector, actions as listActions } from '../../redux/modules/plantingsList'
import {getEventAtIndex} from 'utils/plantings'
import createGetStyle from 'utils/getStyle'

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
})


const l10n = {
  'PlantingLog.AddEventButton': 'Add New Event',
  'PlantingLog.Event.Plant.Material.Seed': 'Seed',
  'PlantingLog.Event.Plant.Material.Plantlet': 'Plantlet',
  'PlantingLog.Event.Plant.Material.Cutting': 'Cutting',
  'PlantingLog.Event.Plant.Material.Tuber': 'Tuber',
  'PlantingLog.Event.Plant.Recipient.Earth': 'Earth',
  'PlantingLog.Event.Plant.Recipient.Tray': 'Tray',
  'PlantingLog.Event.Plant.Recipient.Modules': 'Modules',
  'PlantingLog.Event.Plant.Recipient.Pots': 'Pots',
  'PlantingLog.Event.Plant.Recipient.Other': 'Other',

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

var plantingLogStyles = {
  container:{
    flexBasis:'60%',
    flexGrow: 1
  }
}

const plantingListStyles = {
  container: {
    flexBasis: '40%',
    flexGrow: 1,
    flexShrink: 1
  },
  closed: {
    container: {
      marginLeft:'-40%'
    }
  }
}

const getListStyle = createGetStyle(plantingListStyles)

export class PlantingsView extends React.Component {
  static propTypes = {
    viewState: PropTypes.object,
    selectedPlanting: PropTypes.object,
    selectedEvent: PropTypes.object,
    logData: PropTypes.object,
    styles: PropTypes.object
  };
  static defaultProps = {
    styles: defaultStyles
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 1)
  };

  // TODO move l10n into store
  l10n (key, data) {
    if (!l10n[key]) {
      return `No l10n for key ${key}`
    }
    return translate(key, data)
  }

  handleAddEventIndent = () => {
    this.props.showEditEventUI({
      plantingId: this.props.viewState.selectedPlantingId,
      eventIndex: -1,
      eventData: {}
    })
  };

  handleEventEditIntent = (eventIndex) => {
    this.props.showEditEventUI({
      plantingId: this.props.viewState.selectedPlantingId,
      eventIndex,
      eventData: getEventAtIndex(this.props.selectedPlanting, eventIndex)
    })
  };

  handleEventDataChange = (eventData) => {
    const {
      selectedPlantingId,
      selectedEventIndex
    } = this.props.viewState
    this.props.editEvent({
      plantingId: selectedPlantingId,
      eventIndex: selectedEventIndex,
      eventData
    })
  };

  handleEventUISave = () => {
    const {
      selectedPlantingId,
      selectedEventIndex,
      eventData
    } = this.props.viewState
    this.props.saveEvent({
      plantingId: selectedPlantingId,
      eventIndex: selectedEventIndex,
      eventData
    })
  };

  handleEventUICancel = () => {
    this.props.hideEditEventUI()
  };

  render () {
    const {
      plantings,
      trashedPlantings,
      activePlantings,
      plants,
      places,
      viewState,
      selectedPlanting,
      selectedEvent,
      logData,
      styles
    } = this.props
    const {width, height} = this.state.dimensions

    console.log(selectedPlanting, selectedEvent, viewState)

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
        console.log('Dimensions: ', dimensions)
        this.setState({dimensions})
        }}>
        <Cover style={{...styles.container, visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          <Cover style={getListStyle('container', {closed: viewState.isEditingEvent})}>
            <PlantingList
              currentPlantings={activePlantings}
              filterFunction={() => true}
              selectedPlantingId={selectedPlanting ? selectedPlanting.id : undefined}
              onPlantingChange={(id) => this.props.setSelectedPlanting({id})}
              onPanelChange={() => true}
            />
          </Cover>
          {selectedPlanting &&
            <PlantingLog
              l10n={(key, data) => this.l10n(`PlantingLog.${key}`, data)}
              planting={selectedPlanting}
              dateRange={logData.dateRange}
              monthEvents={logData.monthEvents}
              onAddEventIntent={this.handleAddEventIndent}
              onEventEditIntent={this.handleEventEditIntent}
              selectedEventIndex={viewState.selectedEventIndex}
              styles={plantingLogStyles}
            />
          }
        </Cover>
      </Measure>
    )
  }
}

export default connect((state, props) => ({
  ...selector(state, props),
  location: props.location
}), {
  ...plantingsActions,
  ...editEventUIActions,
  ...listActions
})(PlantingsView)
