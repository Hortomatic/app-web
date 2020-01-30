import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'

import {
  getPlanting,
  getEventAtIndex,
  getEventDate,
  getEarliestEventDate,
  getLatestEventDate,
  getEarlestTimelineDate,
  getLatestTimelineDate,
  // isEstimate,
  // isEventDateRange,
  formatPlantingForTimeline
} from 'utils/plantings.js'
import {selectActivePlantings} from './plantings'
import {selectPlants} from './plants'
import {selectPlaces} from './places'

// ------------------------------------
// Constants
// ------------------------------------
export const FILTER_ROWS = 'FILTER_ROWS'
export const SHOW_EDIT_EVENT_FORM = 'SHOW_EDIT_EVENT_FORM'
export const SET_TIMELINE_DATE_RANGE = 'SET_TIMELINE_DATE_RANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(FILTER_ROWS)
export const showEditEventForm = createAction(SHOW_EDIT_EVENT_FORM)
export const setDateRange = createAction(SET_TIMELINE_DATE_RANGE)

export const actions = {
  filter,
  showEditEventForm,
  setDateRange
}

// ------------------------------------
// Reducer
// ------------------------------------
export function handleShowEditEventForm (state, {payload}) {
  return {
    ...state,
    ...{
      editEventForm: {
        show: true,
        selectedPlantingId: payload.plantingId,
        selectedEventIndex: payload.eventIndex,
        eventData: payload.eventData
      }
    }
  }
}

export function handleSetDateRange (state, {payload}) {
  return {
    ...state,
    ...{
      from: payload.from,
      to: payload.to
    }
  }
}

export const reducer = handleActions({
  [FILTER_ROWS]: (state, { payload }) => state + payload,
  [SHOW_EDIT_EVENT_FORM]: handleShowEditEventForm,
  [SET_TIMELINE_DATE_RANGE]: handleSetDateRange
}, {
  editEventForm: {
    show: false,
    eventData: undefined
  },
  from: moment().startOf('year').toDate(),
  to: moment().startOf('year').add(1, 'year').toDate()
})

// ------------------------------------
// Selector
// ------------------------------------

export const selectTimelineData = createSelector(
  selectActivePlantings,
  selectPlants,
  selectPlaces,
  (plantings, plants, places) => {
    console.warn('recalculating timeline data')
    return _([...plantings.values()])
    // only plantings with a timeline
    .filter(p => p.timeline && p.timeline.length)
    // create an object that the timeline can use
    .map(_.partial(formatPlantingForTimeline, plants, places))
    .groupBy('placeId')
    .map((group, id) => ({
      name: id,
      tracks: group
    }))
    .value()
  }
)

// padding the date range out acts as a performance improvement
// so data is only recalculated when the date range crosses a year border
// since the return value from these funcions will be equality checked
// as the argument to the next selector, they output a string instead
// of a date object
// TODO this could be cleaner with a custom rolled createSelector function
// using createSelectorCreator which can deep equality check and compare
// date values instead of ===ing Date instances
export const selectFromDateString = createSelector(
  selectTimelineState,
  (state) => {
    return moment(state.from).startOf('year').subtract(2, 'year').toString()
  }
)
export const selectToDateString = createSelector(
  selectTimelineState,
  (state) => {
    return moment(state.to).startOf('year').add(2, 'year').toString()
  }
)

export const selectTimelineDataForRange = createSelector(
  selectFromDateString,
  selectToDateString,
  selectTimelineData,
  (from, to, data) => {
    from = new Date(from)
    to = new Date(to)
    console.warn('refiltering timeline data', data, from, to)

    return data
    // only plantings that exist within or span the current date range
      .filter(g => {
        let [earliest, latest] = g.tracks.reduce((r, track) => {
          if (track.from < r[0]) {
            r[0] = track.from
          }
          if (track.to > r[1]) {
            r[1] = track.to
          }
          return r
        }, [new Date(), new Date()])
        return (
          earliest > from && earliest < to || // starts within date range
          earliest < from && latest > to || // spans date range
          latest > from && latest < to // ends within date range
        )
      })
  }
)

export function selectTimelineState (state) {
  return state.timeline
}

export function selectEditEventForm (state) {
  return state.timeline.editEventForm
}

export const selectEditEventFormData = createSelector(
  selectActivePlantings,
  selectEditEventForm,
  (plantings, editEventForm) => {
    if (editEventForm.show === true) {
      let eventData = _.cloneDeep(
        getEventAtIndex(
          getPlanting(plantings, editEventForm.selectedPlantingId),
          editEventForm.selectedEventIndex
        )
      )
      eventData.date = getEventDate(eventData)
      return eventData
    } else {
      return {}
    }
  }
)

export const selector = createSelector(
  selectActivePlantings,
  selectTimelineState,
  selectTimelineData,
  (plantings,
    viewState,
    timelineData) => ({
      plantings,
      viewState,
      timelineData
    })
)
