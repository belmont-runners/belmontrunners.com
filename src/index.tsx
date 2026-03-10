import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import configureStore from './store'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import * as serviceWorker from './serviceWorker'
import theme from './MuiTheme'
import { ThemeProvider } from '@mui/material/styles'
import { ThemeProvider as LegacyThemeProvider } from '@mui/styles'


const store = configureStore()

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing VITE_STRIPE_PUBLIC_KEY')
}

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LegacyThemeProvider theme={theme}>
            {/*@ts-ignore*/}
            <App />
          </LegacyThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
