import {createAction, handleActions} from 'redux-actions'
// import _ from 'lodash'
import moment from 'moment'
// import {routeActions} from 'redux-simple-router'
import {take, put, call, race} from 'redux-saga'

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
// ------------------------------------'
export const ADD_PLANTING_STEP_INITIAL = 'ADD_PLANTING_STEP_INITIAL'
export const ADD_PLANTING_STEP_PLANT = 'ADD_PLANTING_STEP_PLANT'
export const ADD_PLANTING_STEP_NAME = 'ADD_PLANTING_STEP_NAME'
export const ADD_PLANTING_STEP_EVENTS = 'ADD_PLANTING_STEP_EVENTS'

export const START_ADD_PLANTING_FLOW = 'START_ADD_PLANTING_FLOW'
export const ABORT_ADD_PLANTING_FLOW = 'ABORT_ADD_PLANTING_FLOW'
// set the current step in the flow
export const SET_ADD_PLANTING_STEP = 'SET_ADD_PLANTING_STEP'
export const GO_STEP_PLANT = 'ADD_PLANTING_GO_STEP_PLANT'
export const GO_STEP_NAME = 'ADD_PLANTING_GO_STEP_NAME'
export const GO_STEP_EVENTS = 'ADD_PLANTING_GO_STEP_EVENTS'

// show and hide the UI
export const SHOW_ADD_PLANTING_UI = 'SHOW_ADD_PLANTING_UI'
export const HIDE_ADD_PLANTING_UI = 'HIDE_ADD_PLANTING_UI'
// set a value for the planting
export const ADD_PLANTING_SET_PLANT = 'ADD_PLANTING_SET_PLANT'
export const ADD_PLANTING_SET_NAME = 'ADD_PLANTING_SET_NAME'

export const SAVE_NEW_PLANTING = 'SAVE_NEW_PLANTING'
export const SAVING_NEW_PLANTING = 'SAVING_NEW_PLANTING'
export const SAVED_NEW_PLANTING = 'SAVED_NEW_PLANTING'

// ------------------------------------
// Actions
// ------------------------------------

export const startAddPlantingFlow = createAction(START_ADD_PLANTING_FLOW)
export const abortAddPlantingFlow = createAction(ABORT_ADD_PLANTING_FLOW)

export const showAddPlantingUI = createAction(SHOW_ADD_PLANTING_UI)
export const hideAddPlantingUI = createAction(HIDE_ADD_PLANTING_UI)

export const setAddPlantingStep = createAction(SET_ADD_PLANTING_STEP)

export const saveNewPlanting = createAction(SAVE_NEW_PLANTING)
export const savingNewPlanting = createAction(SAVING_NEW_PLANTING)
export const savedNewPlanting = createAction(SAVED_NEW_PLANTING)

export const actions = {
  startAddPlantingFlow,
  abortAddPlantingFlow,
  setAddPlantingStep,

  showAddPlantingUI,
  hideAddPlantingUI,

  saveNewPlanting,
  savingNewPlanting,
  savedNewPlanting
}

// ------------------------------------
// Reducer
// ------------------------------------
function handleSetAddPlantingStep (state, {payload}) {
  return {
    ...state,
    step: payload
  }
}

function handleShowAddPlantingUI (state, {payload}) {
  return {
    ...state,
    isOpen: true
  }
}

function handleHideAddPlantingUI (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: undefined,
    isOpen: false,
    eventData: undefined,
    eventSaveStatus: INITIAL
  }
}

// see the related saga for flow control. these reducers
// just manage state
function handleSaveNewPlanting (state, {payload}) {
  return {
    ...state,
    saveStatus: INITIAL
  }
}

function handleSavingNewPlanting (state, {payload}) {
  return {
    ...state,
    saveStatus: SAVING
  }
}

function handleSavedNewPlanting (state, {payload}) {
  return {
    ...state,
    saveStatus: SAVED
  }
}

export const reducer = handleActions({
  [SHOW_ADD_PLANTING_UI]: handleShowAddPlantingUI,
  [HIDE_ADD_PLANTING_UI]: handleHideAddPlantingUI,
  [SET_ADD_PLANTING_STEP]: handleSetAddPlantingStep,
  [SAVE_NEW_PLANTING]: handleSaveNewPlanting,
  [SAVING_NEW_PLANTING]: handleSavingNewPlanting,
  [SAVED_NEW_PLANTING]: handleSavedNewPlanting
}, {
  isOpen: false,
  eventSaveStatus: INITIAL,
  step: ADD_PLANTING_SET_PLANT,
  plantingData: {}
})

// ------------------------------------
// Selectors
// ------------------------------------
export function selectState (state) {
  return state.addPlantingUI
}

export const selector = createSelector(
  selectState,
  selectActivePlantings,
  selectPlaces,
  selectPlants,
  (
    state,
    plantings,
    places,
    plants
  ) => ({
    plantingData: state.plantingData,
    plantings,
    places,
    plants
  })
)

// ------------------------------------
// Sagas
// ------------------------------------
const wait = (ms) => new Promise((resolve) => setInterval(() => resolve(), ms))

// FIXME once the Babel generators transform-runtime bug is fixed,
// get rid of the factory and export directly
function sagaFactory () {

  function * setPlant () {
    while (true) {
      yield take(GO_STEP_PLANT)

      let {payload} = yield take(SET_PLANT)
      race(
        yield take(SAVE_STEP_PLANT),
        yield call(addNewPlant)
      )
    }
  }

  function * addNewPlant () {
    while (true) {
      yield take(GO_ADD_PLANT)
      // TODO make sure payload is good to pass along to setPlant
      let {payload} = yield take(ADD_PLANT_SAVE)
      yield put(setPlant(payload))
    }
  }

  function * addPlantingSaga () {
    while (true) {
      yield take(START_ADD_PLANTING_FLOW)
      yield put(setAddPlantingStep(ADD_PLANTING_STEP_INITIAL))
      yield put(showAddPlantingUI())
      yield take(ADD_PLANTING_NEXT_STEP)
      yield put(setAddPlantingStep(ADD_PLANTING_STEP_NAME))
      yield take(ADD_PLANTING_SET_NAME)

      yield take(ADD_PLANTING_SAVE)
      yield put(hideAddPlantingUI())
    }
  }

  function * abortableAddPlantingFlow () {
    while (true) {
      const {complete, abort} = race(
        // wait for entire addPlantingSaga to complete
        yield call(addPlantingSaga),
        // the flow can be aborted at any time
        yield take(ABORT_ADD_PLANTING_FLOW)
      )

      if (abort) {
        yield put(hideAddPlantingUI())
        // yield put(resetAddPlantingUI())
      }

      if (complete) {
        // show a congratulations?

        // dispatch an action to highlight the planting in whatever view the
        // user is in?
        yield put(hideAddPlantingUI())
      }
    }
  }

  return [
    addPlantingSaga,
    abortableAddPlantingFlow
  ]
}
const sagasArray = sagaFactory()

export const addPlantingSaga = sagasArray[0]
export const abortableAddPlantingFlowSaga = sagasArray[1]

export const sagas = [
  abortableAddPlantingFlowSaga
]
