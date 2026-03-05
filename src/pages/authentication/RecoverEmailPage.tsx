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
import { auth } from '../../firebase'
import {applyActionCode, AuthError, sendPasswordResetEmail } from 'firebase/auth'

const RecoverEmailPage = () => {
  const location = useLocation()
  // @ts-ignore
  const { info: { data: { email } }, query: { oobCode } } = location.state
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
        console.error(error)
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
        console.log('calling sendPasswordResetEmail')
        try {
          await sendPasswordResetEmail(auth, email)
          setIsSuccess(true)
          setErrorMessage('')
        } catch (error) {
          const { code, message } = error as AuthError
          console.error(error)
          console.error('RecoverEmailPage', 'code:', code, 'message:', message)
          setErrorMessage(message)
        }
      } catch (error) {
        processError(error as AuthError)
      }
    })()
  }, [oobCode, email])

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
      <DialogTitle>Recover Email</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {isSuccess && (
            <div className="text-success text-center ">
              Your email ({email}) has been successfully recovered.
              <br />A password reset confirmation email has been sent to your
              email. Please follow the instructions in the email to reset your
              password.
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

export default RecoverEmailPage
