import React from 'react'
import {storiesOf, action} from '@kadira/storybook'

import Plotter from '../'
import Background from '../Background'
import Grid from '../Grid'

const wrapStyle = {
  backgroundColor: '#aee',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function wrap (component, styles = {}) {
  return (
    <div style={{...wrapStyle, ...styles}}>{component}</div>
  )
}

const plantings = [
  {
    name: 'Coliflor do nadal',
    id: 1,
    "x": 50,
    "y": 50,
    "width": 200,
    "height": 40,
    "rotation": 0,
    "color": '#A48ADB',
    "progress": 0.2
  },
  {
    name: 'Brussel Sprouts',
    id: 2,
    "x": 50,
    "y": 200,
    "width": 100,
    "height": 70,
    "rotation": -20,
    "color": '#78C76D',
    "progress": 0.7
  },
  {
    name: 'Winter Cabbage',
    id: 3,
    "x": 300,
    "y": 50,
    "width": 100,
    "height": 70,
    "rotation": 90,
    "color": '#F06F68',
    "progress": 0.5
  }
]
storiesOf('Plotter', module)
// .add('Background', () => wrap(
//   <Background />
// ))
// .add('Grid', () => wrap(
//   <Grid />
// ))
.add('with data', () => wrap(
  <Plotter
    width={500}
    height={500}
    plantings={plantings}
  />
))
