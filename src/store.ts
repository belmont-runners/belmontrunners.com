import { configureStore } from '@reduxjs/toolkit'
import createRootReducer from './reducers/rootReducer'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import LogRocket from 'logrocket'

export const history = createBrowserHistory()

export default function createStore(initialState = {}) {
  return configureStore({
    reducer: createRootReducer(history),
    preloadedState: initialState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(
        routerMiddleware(history),
        LogRocket.reduxMiddleware()
      ),
  })
}
