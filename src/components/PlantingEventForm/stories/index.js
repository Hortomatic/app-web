import React from 'react'
import {storiesOf, action} from '@kadira/storybook'

import EventForm from '../EventForm'

const wrapStyle = {
  backgroundColor: '#aee',
  width: '100%',
  minHeight: '100vh'
}

function wrap (component, styles = {}) {
  return (
    <div style={{...wrapStyle, ...styles}}>{component}</div>
  )
}

function l10n (key) {
  return l10nData[key] || `l10n: ${key}`
}

const l10nData = {
  'DatePickerLabel': 'Date',
  'EventNameLabel': 'Event Name',
  'EventNameHint': 'Some hint to the user about this field',
  'NotesLabel': 'Notes'
}

let eventData = {}
function eventDataChangeHandler (newEventData) {
  eventData = newEventData
  action('event data change')
  console.log(eventData)
}

storiesOf('PlantingEventForm', module)
  .add('EventForm', () => wrap(
    <EventForm
      l10n={l10n}
      eventData={eventData}
      onChange={eventDataChangeHandler}
    />
  ))
