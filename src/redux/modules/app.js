import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_MODULE = 'SET_APP_MODULE'

// ------------------------------------
// Actions
// ------------------------------------
export const setModule = createAction(SET_APP_MODULE)

export const actions = {
  setModule
}

// ------------------------------------
// Reducer
// ------------------------------------
export function setAppModule (state, {payload}) {
  return {
    ...state,
    activeModule: payload.activeModule
  }
}
export const reducer = handleActions({
  [SET_APP_MODULE]: setAppModule
}, {
  activeModule: undefined
})

// ------------------------------------
// Selector
// ------------------------------------
export function selectState (state) {
  return state.app
}
export const selector = createSelector(
  selectState,
  (state) => ({
    ...state
  })
)
