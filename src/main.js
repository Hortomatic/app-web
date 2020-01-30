// require('babel-core/register')
// import "babel-polyfill";

import React from 'react'
import {render} from 'react-native-web'
import { Provider } from 'react-redux'
import {Router, Route, browserHistory} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'
import Hoodie from 'hoodie-client'

import modelArrayToMap from 'utils/modelArrayToMap'


// TODO initialize data from Pouch/Hoodie
const initialState = require('./initialDevState.json')
initialState.plantings = modelArrayToMap(initialState.plantings)
initialState.places = modelArrayToMap(initialState.places)
initialState.plants = modelArrayToMap(initialState.plants)

const store = configureStore(initialState)
const history = syncHistoryWithStore(browserHistory, store)

// Render the React application to the DOM
render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root'),
  () => document.title = 'Hortomatic'
)
