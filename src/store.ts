import { configureStore } from '@reduxjs/toolkit'
import currentUser from './reducers/currentUser'
import LogRocket from 'logrocket'

export default function createStore(initialState = {}) {
  return configureStore({
    reducer: {
      currentUser,
    },
    preloadedState: initialState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(
        LogRocket.reduxMiddleware()
      ),
  })
}
