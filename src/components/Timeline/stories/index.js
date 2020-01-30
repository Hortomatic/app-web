import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs'
import Measure from 'react-measure'

import Container from './container'
import Timeline from '../'

const fixture = require('./fixture.json')

const WrappedTimeline = Container(Timeline)

const wrapStyle = {
  backgroundColor: '#aee',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}

function wrap (component, styles = {}) {
  return (
    <div style={{...wrapStyle, ...styles}}>
      {component}
    </div>
  )
}

// array reducer. given an unsorted array of dates, reduce to the earliest
function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}
// array reducer. given an unsorted array of dates, reduce to the latest
function latest (latest, value, i) {
  return value > latest ? value : latest
}

function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestDate(event)).reduce(latest)
}

const initialFrom = new Date('2015-01-01')
const initialTo = new Date('2016-01-01')

// unserialize dates from JSON
const data = fixture.map(item => ({
  ...item,
  tracks: item.tracks.map(track => ({
    ...track,
    from: new Date(track.from),
    to: new Date(track.to),
    markers: track.markers.map(m => ({...m, date: new Date(m.date)})),
    periods: track.periods.map(p => ({...p, from: new Date(p.from), to: new Date(p.to)})),
    lines: track.lines.map(l => ({...l, from: new Date(l.from), to: new Date(l.to)}))
  }))
}))

console.dir(data)

const stories = storiesOf('Timeline', module)

stories.addDecorator(withKnobs);

stories.add('with data', () => {
  return wrap(<WrappedTimeline {...{initialFrom, initialTo, data}} />)
})
