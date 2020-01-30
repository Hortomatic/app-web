import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import {StyleSheet} from 'react-native-web'

import Log from '../'

const fixture = require('./fixture.json')

const wrapStyle = {
  backgroundColor: '#ee9',
  width: '100%',
  height: '100%',
  display: 'flex'
}

function renderStyle () {
  return StyleSheet._renderToString()
}

function wrap (component, styles = {}) {
  let style = document.getElementById('react-stylesheet')
  if (style) {
    style.textContent = renderStyle()
  }
  else {
    document.getElementById('root').insertAdjacentHTML('beforebegin',
      '<style id=\'react-stylesheet\'>' +
      renderStyle()+
      '</style>'
    )
  }
  return (
    <div style={{...wrapStyle, ...styles}}>
      {component}
    </div>
  )
}

function l10n (key) {
  return l10nData[key] || `l10n: ${key}`
}

const l10nData = {

}


let selectedEventIndex
const plantingLogStyles = {
  container: {
    flexGrow: 1
  }
}

function handleAddEventIntent () {

}
function handleEventEditIntent () {

}

storiesOf('PlantingLog', module)
.add('test', () => wrap(
  <Log
    l10n={l10n}
    planting={fixture.plantingData}
    dateRange={fixture.dateRange}
    monthEvents={fixture.monthEvents}
    onAddEventIntent={action('Add Event Intent')}
    onEventEditIntent={action('Edit Event Intent')}
    selectedEventIndex={selectedEventIndex}
    styles={plantingLogStyles}
  />
))
