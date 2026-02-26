import { auth } from '../../firebase'
import React, { useState, useEffect } from 'react'
import {
  EXPIRED_ACTION_CODE,
  INVALID_ACTION_CODE_INVALID_URL,
  USER_DISABLED_INVALID_URL,
  USER_NOT_FOUND_INVALID_URL
} from '../../messages'
import { Navigate, useLocation } from 'react-router-dom'
import { ROOT } from '../../urls'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import * as Sentry from '@sentry/browser'
import {applyActionCode, AuthError } from 'firebase/auth'

const VerifyEmailPage = () => {
  const location = useLocation()
  // @ts-ignore
  const { query: { oobCode } } = location.state
  const [close, setClose] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const processError = (error: AuthError) => {
    const { code, message } = error
    switch (code) {
      case 'auth/expired-action-code':
        setErrorMessage(EXPIRED_ACTION_CODE)
        return
      case 'auth/invalid-action-code':
        setErrorMessage(INVALID_ACTION_CODE_INVALID_URL)
        return
      case 'auth/user-disabled':
        setErrorMessage(USER_DISABLED_INVALID_URL)
        return
      case 'auth/user-not-found':
        setErrorMessage(USER_NOT_FOUND_INVALID_URL)
        return
      default:
        Sentry.captureException(error)
        console.error('RecoverEmailPage', 'code:', code, 'message:', message)
        setErrorMessage(message)
    }
  }

  useEffect(() => {
    ;(async function() {
      // Get the restored email address.

      console.log('calling applyActionCode')
      try {
        await applyActionCode(auth, oobCode)
        setIsSuccess(true)
      } catch (error) {
        processError(error as AuthError)
      }
    })()
  }, [oobCode])


  if (close) {
    console.log('redirecting to root', close)
    return <Navigate to={ROOT} replace />
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      onClose={() => setClose(true)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>Verify Email</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {isSuccess && (
            <div className="text-success text-center">
              Your email has been verified
            </div>
          )}
          {errorMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setClose(true)}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VerifyEmailPage
