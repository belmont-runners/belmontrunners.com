import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import configureStore from './store'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Elements, StripeProvider } from 'react-stripe-elements'
import ErrorBoundary from './components/ErrorBoundary'
import * as serviceWorker from './serviceWorker'
import * as Sentry from '@sentry/browser'
import theme from './MuiTheme'
import { ThemeProvider } from '@mui/material/styles'

// Sentry init
Sentry.init({
  dsn: 'https://38a18be9353a4b6ba6d58b6be978d285@sentry.io/1469731',
  debug: process.env.NODE_ENV !== 'production'
})

const store = configureStore()

console.log(
  'import.meta.env.VITE_STRIPE_PUBLIC_KEY:',
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
)

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing VITE_STRIPE_PUBLIC_KEY')
} else {
  const container = document.getElementById('root')!
  const root = createRoot(container)
  root.render(
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
              <Elements>
                {/*@ts-ignore*/}
                <App />
              </Elements>
            </StripeProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister()
}
