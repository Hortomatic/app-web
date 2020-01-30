import {createAction, handleActions} from 'redux-actions'
// import _ from 'lodash'
import {routeActions} from 'redux-simple-router'
import {take, put, call} from 'redux-saga'
import moment from 'moment'

import {
  INITIAL,
  SAVING,
  SAVED,
  FAILED
} from 'constants/status'
import {createSelector} from 'reselect'
import {selectPlaces} from './places'
import {selectPlants} from './plants'
import {
  setPlantingEvent,
  selectPlantingsWithRelations,
  selectActivePlantings,
  selectTrashedPlantings
} from './plantings'
import {
  SHOW_EDIT_EVENT_UI,
  HIDE_EDIT_EVENT_UI,
  SAVE_EVENT,
  SAVING_EVENT,
  SAVED_EVENT
} from './editEventUI'
import {
  formatPlantingForLog,
  getPlanting,
  getEventAtIndex
} from 'utils/plantings'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_SELECTED_PLANTING = 'SET_SELECTED_PLANTING'
export const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT'


// ------------------------------------
// Actions
// ------------------------------------
// export const setSelectedPlanting = createAction(SET_SELECTED_PLANTING, (value) => {
//   routeActions.replace(`/plantings/${value.id}`)
//   return value
// })
export function setSelectedPlanting (payload) {
  return (dispatch) => {
    dispatch(routeActions.replace(`/plantings/${payload.id}`))
    dispatch({
      type: SET_SELECTED_PLANTING,
      payload
    })
  }
}

export const setSelectedEvent = createAction(SET_SELECTED_EVENT, (value) => {
  // TODO update URL
  return value
})

export const actions = {
  setSelectedPlanting,
  setSelectedEvent
}

// ------------------------------------
// Reducer
// ------------------------------------

function handleSetSelectedPlanting (state, {payload}) {
  return {
    ...state,
    selectedPlantingId: payload.id,
    selectedEventIndex: undefined,
    isEditingEvent: false
  }
}

function handleSetSelectedEvent (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: payload.eventIndex
  }
}

function handleShowEditEventUI (state, {payload}) {
  return {
    ...state,
    // selectedEventIndex: payload.eventIndex,
    isEditingEvent: true,
    // eventData: payload.eventData
  }
}

function handleHideEditEventUI (state, {payload}) {
  return {
    ...state,
    // selectedEventIndex: undefined,
    isEditingEvent: false,
    // eventData: undefined,
    // eventSaveStatus: INITIAL
  }
}

function handleEditEvent (state, {payload}) {
  let eventData = {...payload.eventData}
  if (eventData.date) {
    if (moment().isBefore(eventData.date) ) {
      eventData.estimateDate = eventData.date
    } else {
      eventData.actualDate = eventData.date
    }
  }
  return {
    ...state,
    eventData
  }
}
// see the related saga for flow control. these reducers
// just manage state
function handleSaveEvent (state, {payload}) {
  return state
}

function handleSavingEvent (state, {payload}) {
  return {
    ...state,
    eventSaveStatus: SAVING
  }
}

function handleSavedEvent (state, {payload}) {
  return {
    ...state,
    eventSaveStatus: SAVED
  }
}

export const reducer = handleActions({
  [SET_SELECTED_PLANTING]: handleSetSelectedPlanting,
  [SET_SELECTED_EVENT]: handleSetSelectedEvent,
  [SHOW_EDIT_EVENT_UI]: handleShowEditEventUI,
  [HIDE_EDIT_EVENT_UI]: handleHideEditEventUI,
  // [EDIT_EVENT]: handleEditEvent,
  // [SAVE_EVENT]: handleSaveEvent,
  // [SAVING_EVENT]: handleSavingEvent,
  // [SAVED_EVENT]: handleSavedEvent
}, {
  selectedPlantingId: undefined,
  selectedEventIndex: undefined,
  isEditingEvent: false,
  eventSaveStatus: INITIAL
})

// ------------------------------------
// Selectors
// ------------------------------------
export function selectViewState (state) {
  return state.plantingsList
}

export const selectSelectedPlantingId = createSelector(
  selectViewState,
  (state) => {
    return state.selectedPlantingId
  }
)

export const selectSelectedPlanting = createSelector(
  selectSelectedPlantingId,
  selectPlantingsWithRelations,
  (id, plantings) => {
    return getPlanting(plantings, id)
  }
)

export const selectSelectedEvent = createSelector(
  selectSelectedPlanting,
  (state) => selectViewState(state).selectedEventIndex,
  (planting, eventIndex) => planting && getEventAtIndex(planting, eventIndex) || undefined
)

export const selectLogData = createSelector(
  selectPlants,
  selectPlaces,
  selectSelectedPlanting,
  (plants, places, planting) => {
    return planting ? formatPlantingForLog(plants, places, planting) : undefined
  }
)

export const selector = createSelector(
  selectPlantingsWithRelations,
  selectTrashedPlantings,
  selectActivePlantings,
  selectPlaces,
  selectPlants,
  selectViewState,
  selectSelectedPlanting,
  selectSelectedEvent,
  selectLogData,
  (
    plantings,
    trashedPlantings,
    activePlantings,
    places,
    plants,
    viewState,
    selectedPlanting,
    selectedEvent,
    logData
  ) => ({
    plantings,
    trashedPlantings,
    activePlantings,
    places,
    plants,
    viewState,
    selectedPlanting,
    selectedEvent,
    logData
  })
)

// ------------------------------------
// Sagas
// ------------------------------------
const wait = (ms) => new Promise((resolve) => setInterval(() => resolve(), ms))

// FIXME when the Babel generators transform-runtime bug is fixed,
// get rid of the factory and export directly
function sagaFactory () {
  return [

    function * savePlantingEventFromUI () {
      while (true) {
        const {payload} = yield take(SAVE_EVENT)
        // const {plantingId, eventIndex, eventData} = payload
        yield put(savingEvent())
        yield put(setPlantingEvent(payload))
        yield put(savedEvent())
        yield call(wait, 1000)
        yield put(hideEditEventUI())
      }
    }

  ]
}
const sagasArray = sagaFactory()

export const savePlantingEventFromUI = sagasArray[0]

export const sagas = [
  ...sagasArray
]
