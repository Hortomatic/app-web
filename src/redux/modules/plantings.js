import {createAction, handleActions} from 'redux-actions'
import _ from 'lodash'
import cloneMap from 'utils/cloneMap'

import {createSelector} from 'reselect'
import {selectPlaces} from './places'
import {selectPlants} from './plants'
import {getPlace, getPlaceName} from 'utils/places.js'
import {getPlant, getPlantName} from 'utils/plants.js'
import {getPlanting, getPlantingName, getPlaceIdFromTimeline} from 'utils/plantings.js'

// ------------------------------------
// Constants
// ------------------------------------
//
export const SHOW_CREATE_PLANTING_UI = 'createPlantingUI'

// overwrite with new data
export const SET_PLANTING = 'setPlanting'
export const SET_PLANTING_EVENT = 'setPlantingEvent'
export const SET_PLANTING_EVENT_DATE = 'setPlantingEventDate'

// merge new data over existing
export const UPDATE_PLANTING = 'updatePlanting'
export const UPDATE_PLANTING_EVENT = 'updatePlantingEvent'

export const TRASH_PLANTING = 'trashPlanting'

// ------------------------------------
// Actions
// ------------------------------------
export const addPlanting = createAction(SHOW_CREATE_PLANTING_UI)
export const setPlantingEventDate = createAction(SET_PLANTING_EVENT_DATE)
export const setPlanting = createAction(SET_PLANTING)
export const setPlantingEvent = createAction(SET_PLANTING_EVENT)
export const updatePlanting = createAction(UPDATE_PLANTING)
export const updatePlantingEvent = createAction(UPDATE_PLANTING_EVENT)

export const actions = {
  setPlantingEventDate,
  setPlanting,
  setPlantingEvent,
  updatePlanting,
  updatePlantingEvent
}

// ------------------------------------
// Reducer
// ------------------------------------
export function showPlantingUI (state) {
  return state
}

export function handleSetPlanting (state, {payload}) {
  const {plantingId, plantingData} = payload
  const newState = cloneMap(state)
  return newState.set(plantingId, plantingData)
}

export function handleSetPlantingEvent (state, {payload}) {
  const { plantingId, eventIndex, eventData } = payload

  // TODO... look into using Immutable to make this easier
  const newState = cloneMap(state)
  if (eventIndex === -1) {
    newState.get(plantingId).timeline.push(eventData)
  }else{
    newState.get(plantingId).timeline[eventIndex] = eventData
  }
  return newState
}

export function handleSetPlantingEventDate (state, {payload}) {
  // console.log('setPlantingEventDate', state, payload, arguments)
  const { plantingId, eventIndex, date, dateType } = payload

  const newState = cloneMap(state)
  const newEvent = {
    ...newState.get(plantingId).timeline[eventIndex],
    actualDate: date
  }
  newState.get(plantingId).timeline[eventIndex] = newEvent
  return newState
}

export function handleUpdatePlanting (state, {payload}) {
  const {plantingId, plantingData} = payload
  const newState = cloneMap(state)
  return newState.set(plantingId, {
    ...newState.get(plantingId),
    ...plantingData
  })
}

export function handleUpdatePlantingEvent (state, {payload}) {
  const { plantingId, eventIndex, eventData } = payload

  // TODO... look into using Immutable to make this easier
  const newState = cloneMap(state)
  newState.get(plantingId).timeline[eventIndex] = {
    ...newState.get(plantingId).timeline[eventIndex],
    ...eventData
  }
  return newState
}

export const reducer = handleActions({
  [SHOW_CREATE_PLANTING_UI]: showPlantingUI,
  [SET_PLANTING_EVENT_DATE]: handleSetPlantingEventDate,
  [SET_PLANTING]: handleSetPlanting,
  [SET_PLANTING_EVENT]: handleSetPlantingEvent,
  [UPDATE_PLANTING]: handleUpdatePlanting,
  [UPDATE_PLANTING_EVENT]: handleUpdatePlantingEvent
}, [])

// ------------------------------------
// Selectors
// ------------------------------------
export const selectPlantings = function (state) {
  return state.plantings
}

export const selectPlantingsWithRelations = createSelector(
  selectPlantings,
  selectPlaces,
  selectPlants,
  (plantings, places, plants) => {
    return new Map([...plantings].map(([plantingId, planting]) => {
      const placeId = getPlaceIdFromTimeline(planting)
      const place = placeId && getPlace(places, getPlaceIdFromTimeline(planting))
      const plant = getPlant(plants, planting.plantId)
      // beware! this is not a deep clone. mutating timeline will
      // mutate state
      return [plantingId, {
        ...planting,
        plant,
        place,
        plantName: getPlantName(plant),
        currentPlaceName: place && getPlaceName(place)
      }]
    }))
  }
)
// select plantings which have been trashed
export const selectTrashedPlantings = createSelector(
  selectPlantingsWithRelations,
  (plantings) => {
    return new Map([...plantings].filter(([key, value]) => !!value.isTrashed))
  }
)
// select plantings which have not been trashed
export const selectActivePlantings = createSelector(
  selectPlantingsWithRelations,
  (plantings) => {
    return new Map([...plantings].filter(([key, value]) => !value.isTrashed))
  }
)

// select plantings which are active for the current date
// export const selectCurrentPlantings = createSelector(
//   selectCurrentDate,
//   selectActivePlantings,
//   (plantings) => {
//     return plantings.filter()
//   }
// )

export const selector = createSelector(
  selectPlantingsWithRelations,
  selectTrashedPlantings,
  selectActivePlantings,
  (plantings, trashedPlantings, activePlantings, places, plants) => ({
    plantings, trashedPlantings, activePlantings
  })
)
