import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import moment from 'moment'
import _ from 'lodash'

import {
  getEventDate, 
  getLatestTimelineDate
} from 'utils/plantings.js'

import {selectPlantings, selectActivePlantings} from './plantings'
import {selectPlants} from './plants'
import {selectPlaces} from './places'


// ------------------------------------
// Constants
// ------------------------------------
export const SET_TYPE_FILTER = 'SET_TYPE_FILTER'
export const SET_ACTIVE_PLANTING = 'SET_ACTIVE_PLANTING'


// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(SET_TYPE_FILTER, (value = 1) => value)

export const setActivePlanting = createAction(SET_ACTIVE_PLANTING, (plantingId) => plantingId)


export const actions = {
  filter
}

// ------------------------------------
// Reducer
// ------------------------------------

export function handleSetActivePlanting (state, {payload}) {
  return {...state, ...{activePlantingId: payload.plantingId}}
}

export const reducer = handleActions({
  [SET_TYPE_FILTER]: (state, { payload }) => state + payload,
  [SET_ACTIVE_PLANTING]: handleSetActivePlanting
}, {})

// ------------------------------------
// Selector
// ------------------------------------

export function selectSelectedPlanting (state) {
  return state.journal.selectedPlantingId || undefined
}

export function selectOptions (state) {
  return state.journal.options || {
    groupBy: 'month'
  }
}

// const defaultLogDataRange = [
//   moment().startOf('month').toDate(),
//   moment().startOf('month').add(1, 'month').toDate()
// ]
// export const selectLogData = createSelector(
//   selectPlantings,
//   selectPlants,
//   selectPlaces,
//   selectSelectedPlanting,
//   selectOptions,
//   (plantings, plants, places, selectedPlantingId, options) => {
//     if (!selectedPlantingId) {
//       return false
//     }
//     let selectedPlanting = plantings[selectedPlantingId] 
//     let timeline = selectedPlanting.timeline.filter(e => e.eventDateType==='day' && e.eventType==='activity')
//     return {
//       range: timeline.length 
//       ? [
//           moment(getEventDate(timeline[0])).startOf('month').toDate(),
//           moment(timeline.length > 1 
//             ? getEventDate(_.last(timeline)) 
//             : getEventDate(timeline[0])
//           ).endOf('month').toDate(),
//         ]
//       : defaultLogDataRange,
//       months: _(timeline)
//         .groupBy(ev => moment(getEventDate(ev)).startOf('month').format('YYYY-MM-DD'))
//         .map((events, date) => ({
//           date: new Date(date),
//           events
//         }))
//         .value()
//     }
//   }
// )

export const selector = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  (plantings, plants, places) => ({
    plantings, plants, places
  })
)
