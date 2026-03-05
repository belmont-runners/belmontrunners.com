import { auth } from '../../firebase'
import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { ROOT } from '../../urls'
import { Navigate, useLocation } from 'react-router-dom'
import {
  EXPIRED_ACTION_CODE,
  INVALID_ACTION_CODE_INVALID_URL,
  USER_DISABLED_INVALID_URL,
  USER_NOT_FOUND_INVALID_URL
} from '../../messages'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { AuthError, checkActionCode } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

const Complete = () => {
  const { search } = useLocation()

  const [errorMessage, setErrorMessage] = useState('')
  const [redirect, setRedirect] = useState<JSX.Element>()

  const processError = (error: FirebaseError) => {
    const { code, message } = error
    console.log('code:', code, 'message:', message)
    switch (code) {
      case 'auth/expired-action-code':
        setErrorMessage(EXPIRED_ACTION_CODE)
        break
      case 'auth/invalid-action-code':
        setErrorMessage(INVALID_ACTION_CODE_INVALID_URL)
        break
      case 'auth/user-disabled':
        setErrorMessage(USER_DISABLED_INVALID_URL)
        break
      case 'auth/user-not-found':
        setErrorMessage(USER_NOT_FOUND_INVALID_URL)
        break
      default:
        console.error(error)
        console.error('in Complete', 'code:', code, 'message:', message)
        setErrorMessage(message)
    }
  }

  useEffect(() => {
    const query: { mode?: string, oobCode?: string } = queryString.parse(search) || {}
    const { mode, oobCode } = query

    ;(async function() {
      try {
        if (!oobCode) {
          processError(new FirebaseError('auth/invalid-action-code', INVALID_ACTION_CODE_INVALID_URL ))
          return
        }
        const info = await checkActionCode(auth, oobCode)
        let tmpRedirect
        if (mode) {
          tmpRedirect = (
            <Navigate
              to={`/${mode}`}
              state={{
                info,
                query
              }}
              replace
            />
          )
        } else {
          tmpRedirect = <Navigate to={ROOT} replace />
        }

        setRedirect(tmpRedirect)
      } catch (error) {
        processError(error as AuthError)
      }
    })()
  }, [search])

  if (redirect) {
    return redirect
  } else if (!errorMessage) {
    return ''
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      onClose={() => setRedirect(<Navigate to={ROOT} replace />)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>Error</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <div className="text-danger text-center">{errorMessage}</div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setRedirect(<Navigate to={ROOT} replace />)}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Complete
