import {combineReducers} from 'redux'

// core
import {reducer as app} from './app'

// data models
import {reducer as plantings} from './plantings'
import {reducer as plants} from './plants'
import {reducer as places} from './places'

// global ui
import {reducer as navBarUI} from './navBarUI'
import {reducer as editEventUI} from './editEventUI'

// views
import {reducer as timeline} from './timeline'
import {reducer as journal} from './journal'
import {
  reducer as addPlanting,
  sagas as addPlantingSagas
} from './addPlanting'
import {
  reducer as plantingsList,
  sagas as plantingsListSagas
} from './plantingsList'

export const reducers = {
  app,

  // app data
  plantings,
  plants,
  places,

  // global ui
  navBarUI,
  editEventUI,
  addPlanting,

  // views
  timeline,
  journal,
  plantingsList
}

export const sagas = [
  ...plantingsListSagas,
  ...addPlantingSagas
]
