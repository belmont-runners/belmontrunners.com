import React from 'react'
import {
  Snackbar as MUISnackbar,
  SnackbarContent
} from '@mui/material'
import * as PropTypes from 'prop-types'

const ACTION_COLOR = '#b39ddb'
const LINK_COLOR = 'crimson'

interface Props {
  action?: string
  message: string
  onClose?: () => void
}
function Snackbar({ action, message, onClose }: Props) {
  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open
      onClose={onClose}
    >
      <SnackbarContent
        aria-describedby="client-snackbar"
        sx={{ backgroundColor: '#673ab7' }}
        message={message}
        action={action}
      />
    </MUISnackbar>
  )
}

Snackbar.propTypes = {
  action: PropTypes.any,
  message: PropTypes.any,
  onClose: PropTypes.func
}

export { Snackbar, LINK_COLOR, ACTION_COLOR }
