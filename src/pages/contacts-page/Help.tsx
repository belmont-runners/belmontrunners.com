import React from 'react'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import IconButton from '@mui/material/IconButton'

export default function Help() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <span>
      <IconButton aria-describedby={id} color="primary" onClick={handleClick}>
        <HelpOutlineIcon />
        {/*Glossary*/}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Typography sx={{ p: 2 }}>
          <p><b>Member:</b> someone with a valid membership (paid membership fee in the last 12 months)</p>
          <p><b>User:</b> someone who created an account on our website but is not a member</p>
          <p><b>Subscriber:</b> someone who added their email address via the subscribe form on our website</p>
          <p>
            A subscriber may later be &quot;promoted&quot; to a user if s/he creates an account using the same email address.
            <br />
            A user may later be &quot;promoted&quot; to a member if s/he pays the club membership fee.
            <br />
            A member may later be &quot;demoted&quot; to a user if his/her membership expires.
          </p>
        </Typography>
      </Popover>
    </span>
  )
}
