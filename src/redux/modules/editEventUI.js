import {createAction, handleActions} from 'redux-actions'
// import _ from 'lodash'
import moment from 'moment'
// import {routeActions} from 'redux-simple-router'
import {take, put, call} from 'redux-saga'

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
  selectActivePlantings
} from './plantings'
import {
  getPlanting,
  getEventAtIndex
} from 'utils/plantings'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_EDIT_EVENT_UI = 'SHOW_EDIT_EVENT_UI'
export const HIDE_EDIT_EVENT_UI = 'HIDE_EDIT_EVENT_UI'
export const SET_EDITING_EVENT = 'SET_EDITING_EVENT'
export const EDIT_EVENT = 'EDIT_EVENT'
export const SAVE_EVENT = 'SAVE_EVENT'
export const SAVING_EVENT = 'SAVING_EVENT'
export const SAVED_EVENT = 'SAVED_EVENT'

// ------------------------------------
// Actions
// ------------------------------------
export const setEditingEvent = createAction(SET_EDITING_EVENT)
export const showEditEventUI = function (payload) {
  return (dispatch) => {
    dispatch(setEditingEvent(payload))
    dispatch({
      type: SHOW_EDIT_EVENT_UI,
      payload
    })
  }
}
export const hideEditEventUI = createAction(HIDE_EDIT_EVENT_UI)
export const editEvent = createAction(EDIT_EVENT)
export const saveEvent = createAction(SAVE_EVENT)
export const savingEvent = createAction(SAVING_EVENT)
export const savedEvent = createAction(SAVED_EVENT)

export const actions = {
  showEditEventUI,
  hideEditEventUI,
  setEditingEvent,
  editEvent,
  saveEvent,
  savingEvent,
  savedEvent
}

// ------------------------------------
// Reducer
// ------------------------------------
function handleSetEditingEvent (state, {payload}) {
  return {
    ...state,
    plantingId: payload.plantingId,
    eventIndex: payload.eventIndex,
    eventData: payload.eventData
  }
}

function handleShowEditEventUI (state, {payload}) {
  return {
    ...state,
    isOpen: true
  }
}

function handleHideEditEventUI (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: undefined,
    isOpen: false,
    eventData: undefined,
    eventSaveStatus: INITIAL
  }
}

function handleEditEvent (state, {payload}) {
  let eventData = {...payload.eventData}
  if (eventData.date) {
    if (moment().isBefore(eventData.date)) {
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
  [SET_EDITING_EVENT]: handleSetEditingEvent,
  [SHOW_EDIT_EVENT_UI]: handleShowEditEventUI,
  [HIDE_EDIT_EVENT_UI]: handleHideEditEventUI,
  [EDIT_EVENT]: handleEditEvent,
  [SAVE_EVENT]: handleSaveEvent,
  [SAVING_EVENT]: handleSavingEvent,
  [SAVED_EVENT]: handleSavedEvent
}, {
  plantingId: undefined,
  eventIndex: undefined,
  isOpen: false,
  eventSaveStatus: INITIAL
})

// ------------------------------------
// Selectors
// ------------------------------------
export function selectState (state) {
  return state.editEventUI
}

export const selectPlanting = createSelector(
  selectState,
  selectActivePlantings,
  (state, plantings) => {
    return getPlanting(plantings, state.plantingId)
  }
)
export const selector = createSelector(
  selectState,
  selectPlanting,
  // selectActivePlantings,
  // selectPlaces,
  // selectPlants,
  (
    state,
    planting
    // plantings,
    // places,
    // plants
  ) => ({
    state,
    planting,
    plantingId: state.plantingId,
    eventIndex: state.eventIndex,
    eventData: state.eventData
    // plantings,
    // places,
    // plants
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

    function * saveEventSaga () {
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

export const saveEventSaga = sagasArray[0]

export const sagas = [
  ...sagasArray
]
