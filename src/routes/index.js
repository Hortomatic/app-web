import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from 'layouts/CoreLayout.jsx'

import Home from 'views/Home'

import TimelineView from 'views/timeline'
import PlotsView from 'views/plots'
import JournalView from 'views/journal'
import CalendarView from 'views/calendar'
import PlantingsView from 'views/plantings'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={Home} />
    <Route path='timeline' component={TimelineView} />
    <Route path='plotter' component={PlotsView} />
    <Route path='calendar' component={CalendarView} />
    <Route path='journal' component={JournalView} />
    <Route path='plantings' component={PlantingsView}>
      <Route path='planting/:planting_id' component={PlantingsView} />
    </Route>
  </Route>
)
