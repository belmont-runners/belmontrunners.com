import { auth } from '../firebase'
import {
  Avatar,
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ACCOUNT, CONTACTS, PROFILE, ROOT, USERS } from '../urls'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LoggedInState from './HOC/LoggedInState'
import { Map as IMap } from 'immutable'
import {
  KeyboardArrowDown as ArrowDropDownIcon,
  KeyboardArrowUp as ArrowDropUpIcon
} from '@mui/icons-material'
import initials  from 'initials'
import { useNavigate } from 'react-router-dom'
import { compose } from 'underscore'
import gravatar from 'gravatar'
import { getAvatar, IRedisState, IUser } from '../entities/User'
import { signOut } from 'firebase/auth'

interface Props {
  allowUsersPage: boolean
  allowContactsPage: boolean
  userData: any
}

function Profile({allowUsersPage, allowContactsPage, userData}: Props) {
  const navigate = useNavigate()
  const anchorRef: any = React.useRef(null)
  const [open, setOpen] = React.useState(false)
  const [isGravatarFetched, setIsGravatarFetched] = useState(false)
  const [gravatarUrl, setGravatarUrl] = useState('')
  const userDataJS: IUser = userData.toJS()

  useEffect(() => {
    if (!userData || isGravatarFetched) {
      return
    }
    const func = async () => {
      if (!userDataJS.photoURL && !isGravatarFetched && userDataJS.email) {
        console.log('userData[EMAIL]:', userDataJS.email)
        const uri = gravatar.url(userDataJS.email, {
          protocol: 'https',
          default: '404'
        })
        try {
          const res = await window.fetch(uri)
          if (res.ok) {
            setGravatarUrl(uri)
          }
        } catch (error) {
          console.log('after RP-EXCEPTION', error)
        } finally {
          setIsGravatarFetched(true)
        }
      }
    }

    func()
  }, [userData, isGravatarFetched, userDataJS.email, userDataJS.photoURL])

  function handleToggle() {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (url: string) => (event: any) => {
    if (anchorRef.current && event && anchorRef.current.contains(event.target)) {
      return
    }
    url && navigate(url)

    setOpen(false)
  }


  if (!userDataJS.photoURL && !isGravatarFetched) {
    return null
  }
  // Here we may set it to gravatarUrl.
  // It takes care of new users who just created an account
  // but hadn't had the function job that checks whether they have
  // Gravatar or not.
  const avatarUrl = getAvatar(userDataJS) || gravatarUrl
  return (
    <>
      <div
        style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}
        ref={anchorRef}
        onClick={handleToggle}
      >
        <Avatar sx={{
          cursor: 'pointer',
          width: 40,
          height: 40,
          backgroundColor: 'rgb(98, 71, 234)',
          fontSize: 13.33333
        }} src={avatarUrl}>
          {
            !avatarUrl &&
            // @ts-ignore
            initials(userDataJS.displayName)
          }
        </Avatar>
        <div>
          {open ? (
            <ArrowDropUpIcon sx={{ color: '#fff', height: 24, width: 24 }} />
          ) : (
            <ArrowDropDownIcon sx={{ color: '#fff', height: 24, width: 24 }} />
          )}
        </div>
      </div>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        placement="bottom-end"
        sx={{ zIndex: 10000 }}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps} style={{transformOrigin: 'center top'}}>
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose('')}>
                <MenuList>
                  <MenuItem
                    onClick={handleClose(PROFILE)}
                    sx={{ padding: '10px 40px' }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose(ACCOUNT)}
                    sx={{ padding: '10px 40px' }}
                  >
                    Account
                  </MenuItem>
                  {allowUsersPage && (
                    <MenuItem
                      onClick={handleClose(USERS)}
                      sx={{ padding: '10px 40px' }}
                    >
                      Users
                    </MenuItem>
                  )}
                  {allowContactsPage && (
                    <MenuItem
                      onClick={handleClose(CONTACTS)}
                      sx={{ padding: '10px 40px' }}
                    >
                      Contacts
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem
                    onClick={event => signOut(auth).then(
                      function (){
                        handleClose(ROOT)(event)
                      }
                    )}
                    sx={{ padding: '10px 40px' }}
                  >
                    Sign out
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

Profile.propTypes = {
  allowUsersPage: PropTypes.bool.isRequired,
  allowContactsPage: PropTypes.bool.isRequired,
  userData: PropTypes.object.isRequired
}

const mapStateToProps = ({currentUser: {permissions, firebaseUser, userData}}: IRedisState) => {
  return {
    allowUsersPage:
      !!firebaseUser &&
      (!!permissions.usersRead[firebaseUser.uid] ||
        !!permissions.usersWrite[firebaseUser.uid]),
    allowContactsPage:
      !!firebaseUser &&
      (!!permissions.contactsRead[firebaseUser.uid] ||
        !!permissions.contactsWrite[firebaseUser.uid]),
    // @ts-ignore
    userData: userData ||
      // @ts-ignore
      new IMap()
  }
}

export default compose(
  LoggedInState({name: 'Profile'}),
  connect(mapStateToProps)
)(Profile)
