import thunk from 'redux-thunk'
import {reducers, sagas} from './modules'
import {applyMiddleware, compose, combineReducers, createStore} from 'redux'
import {browserHistory} from 'react-router'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

export default function configureStore (initialState) {
  let createStoreWithMiddleware

  // Sync dispatched route actions to the history
  // const reduxRouterMiddleware = syncHistory(history)

  const middleware = applyMiddleware(
    routerMiddleware(browserHistory),
    thunk,
    createSagaMiddleware(...sagas)
  )

  if (__DEBUG__) {
    const DevTools = require('containers/DevTools')
    createStoreWithMiddleware = compose(
      middleware,
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
    )
  } else {
    createStoreWithMiddleware = compose(middleware)
  }

  const store = createStoreWithMiddleware(createStore)(
    combineReducers({
      ...reducers,
      routing: routerReducer
    }), initialState
  )
  // if (__DEBUG__) {
  //   // Required for replaying actions from devtools to work
  //   reduxRouterMiddleware.listenForReplays(store)
  // }
  if (module.hot) {
    module.hot.accept('./modules', () => {
      const nextRootReducer = require('./modules')

      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
