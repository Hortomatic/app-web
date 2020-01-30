import {createAction, handleActions} from 'redux-actions'
// import {take, put, call} from 'redux-saga'
//
// import {
//   INITIAL,
//   SAVING,
//   SAVED,
//   FAILED
// } from 'constants/status'
import {createSelector} from 'reselect'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_NAVBAR_UI = 'SHOW_NAVBAR_UI'
export const HIDE_NAVBAR_UI = 'HIDE_NAVBAR_UI'

export const NAVBAR_SET_HOVERED_TAB = 'NAVBAR_SET_HOVERED_TAB'
export const NAVBAR_SET_SELECTED_TAB = 'NAVBAR_SET_SELECTED_TAB'

// ------------------------------------
// Actions
// ------------------------------------
export const showNavBarUI = createAction(SHOW_NAVBAR_UI)
export const hideNavBarUI = createAction(HIDE_NAVBAR_UI)

export const setHoveredTab = createAction(NAVBAR_SET_HOVERED_TAB)
export const setSelectedTab = createAction(NAVBAR_SET_SELECTED_TAB)

export const actions = {
  showNavBarUI,
  hideNavBarUI,
  setHoveredTab,
  setSelectedTab
}

// ------------------------------------
// Reducer
// ------------------------------------
function handleShowNavBarUI (state, {payload}) {
  return {
    ...state,
    isOpen: true
  }
}
function handleHideNavBarUI (state, {payload}) {
  return {
    ...state,
    isOpen: false
  }
}
function handleHoveredTab (state, {payload}) {
  return {
    ...state,
    hoveredTab: payload || undefined
  }
}
function handleSelectedTab (state, {payload}) {
  return {
    ...state,
    selectedTab: payload || undefined
  }
}
export const reducer = handleActions({
  [SHOW_NAVBAR_UI]: handleShowNavBarUI,
  [HIDE_NAVBAR_UI]: handleHideNavBarUI,
  [NAVBAR_SET_HOVERED_TAB]: handleHoveredTab,
  [NAVBAR_SET_SELECTED_TAB]: handleSelectedTab
}, {
  isOpen: true,
  showSyncStatus: false,
  hoveredTab: undefined,
  selectedTab: undefined
})

// ------------------------------------
// Selectors
// ------------------------------------
export function selectState (state) {
  return state.navBarUI
}

export const selector = createSelector(
  selectState,
  (
    state
  ) => ({
    ...state
  })
)
