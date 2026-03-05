import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccountCircle as ProfileIcon,
  Close as CloseIcon,
  Contacts as ContactsIcon,
  ExitToApp as SignInIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  People as MembersIcon,
  PeopleOutline as UsersIcon,
  PersonAdd as JoinUsIcon,
  PowerSettingsNew as SignOutIcon,
  SupervisedUserCircle as LeadershipIcon,
  Schedule as ScheduleIcon,
  QuestionAnswer as FAQIcon,
  Settings as AccountIcon
} from '@mui/icons-material'
import Profile from './Profile'
import {
  ACCOUNT,
  CONTACTS,
  FAQ,
  FORGOT_PASSWORD,
  JOIN,
  ABOUT_US,
  MEMBERS,
  PROFILE,
  RESET_PASSWORD,
  ROOT,
  SIGN_IN,
  USERS, SCHEDULE
} from '../urls'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import calc from '../utilities/membershipUtils'
import { User } from 'firebase/auth'
import { IRedisState, IUser } from '../entities/User'
import { auth } from '../firebase'

const TOOLBAR_HEIGHT = 72
const DRAWER_WIDTH = 240
const BACKGROUND_IMAGE = 'linear-gradient(90deg,#141da2,#9b5cf6)'

interface Props {
  isCurrentUserLoaded: boolean,
  firebaseUser: User,
  allowUsersPage: boolean,
  allowContactsPage: boolean,
  isMember: boolean
}

function Header({ isCurrentUserLoaded, firebaseUser, allowUsersPage, allowContactsPage, isMember }: Props) {
  const { pathname } = useLocation()
  const [transparentBackground, setTransparentBackground] = useState(true)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    const evalBackground = () => {
      if (
        pathname !== ROOT &&
        pathname !== SIGN_IN &&
        pathname !== FORGOT_PASSWORD &&
        pathname !== RESET_PASSWORD
      ) {
        setTransparentBackground(false)
        return
      }
      const nav_offset_top: number = TOOLBAR_HEIGHT + 50

      const scroll = window.scrollY
      if (scroll >= nav_offset_top) {
        setTransparentBackground(false)
      } else {
        setTransparentBackground(true)
      }
    }
    window.addEventListener('scroll', evalBackground)
    evalBackground()
    return () => {
      window.removeEventListener('scroll', evalBackground)
    }
  }, [pathname])

  const theme = useTheme()
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('md'))

  const rootStyle: { height?: number } = {}
  const appBarStyle: {
    background?: string,
    position?: 'fixed',
    transform?: string,
    transition?: string,
    backgroundImage?: string,
    top?: number,
  } = {}
  if (transparentBackground && !isSmallDevice) {
    appBarStyle.background = 'transparent'
  } else {
    appBarStyle.position = 'fixed'
    appBarStyle.transform = `translateY(${TOOLBAR_HEIGHT}px)`
    if (!isSmallDevice) {
      appBarStyle.transition = 'transform 500ms ease, background 500ms ease'
    }
    appBarStyle.backgroundImage = BACKGROUND_IMAGE
    appBarStyle.top = -TOOLBAR_HEIGHT
    rootStyle.height = TOOLBAR_HEIGHT

  }
  const styles = {
    root: {
      flexGrow: 1,
      ...rootStyle
    },
    appBar: {
      boxShadow: 'none',
      ...appBarStyle
    },
    toolbar: {
      height: TOOLBAR_HEIGHT,
      margin: isSmallDevice ? 0 : '0 3em'
    },
    menuItem: {
      font: '500 12px/80px "Roboto", sans-serif',
      textTransform: 'uppercase' as const,
      color: 'white',
      cursor: 'pointer'
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
      backgroundColor: '#9b5cf6',
      height: TOOLBAR_HEIGHT
    },
    drawerList: {
      paddingTop: 20,
      paddingLeft: 10
    },
    drawerLink: {
      color: theme.palette.text.primary
    }
  }

  const handleOpenDrawer = () => {
    setShowDrawer(true)
  }

  const handleDrawerClose = (event: { type?: string, key?: string } = {}) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setShowDrawer(false)
  }

  const isSignedOut: boolean = isCurrentUserLoaded && !firebaseUser
  const isSignedIn: boolean = isCurrentUserLoaded && !!firebaseUser

  return (
    <div style={styles.root}>
      <AppBar position="absolute" sx={styles.appBar}>
        {
          isSmallDevice &&
          <SwipeableDrawer
            sx={styles.drawer}
            anchor="right"
            open={showDrawer}
            onOpen={handleOpenDrawer}
            PaperProps={{ sx: { width: DRAWER_WIDTH } }}
            onClose={handleDrawerClose}
          >
            <div style={styles.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon sx={{ color: 'white' }} />
              </IconButton>
            </div>
            <Divider />
            <List sx={styles.drawerList}>
              {
                isSignedOut &&
                <Link to={SIGN_IN} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><SignInIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Sign in' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>

                </Link>
              }
              {
                isSignedOut &&
                <Link to={{
                  pathname: JOIN
                }} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><JoinUsIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Join us' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }
              {
                isSignedIn &&
                <Link to={ROOT} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><HomeIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Home' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }
              {
                isSignedIn &&
                <>
                  <Link to={PROFILE} onClick={handleDrawerClose}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon><ProfileIcon color='primary' /></ListItemIcon>
                        <ListItemText primary='Profile' sx={styles.drawerLink} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link to={ACCOUNT} onClick={handleDrawerClose}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon><AccountIcon color='primary' /></ListItemIcon>
                        <ListItemText primary='Account' sx={styles.drawerLink} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </>
              }

              <Link to={ABOUT_US} onClick={handleDrawerClose}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><LeadershipIcon color='primary' /></ListItemIcon>
                    <ListItemText primary='About Us' sx={styles.drawerLink} />
                  </ListItemButton>
                </ListItem>
              </Link>

              <a href={SCHEDULE} onClick={handleDrawerClose}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><ScheduleIcon color='primary' /></ListItemIcon>
                    <ListItemText primary='Schedule' sx={styles.drawerLink} />
                  </ListItemButton>
                </ListItem>
              </a>

              <Link to={FAQ} onClick={handleDrawerClose}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><FAQIcon color='primary' /></ListItemIcon>
                    <ListItemText primary='FAQ' sx={styles.drawerLink} />
                  </ListItemButton>
                </ListItem>
              </Link>

              {
                isMember &&
                <Link to={MEMBERS} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><MembersIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Members' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }

              {
                allowUsersPage &&
                <Link to={USERS} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><UsersIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Users' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }

              {
                allowContactsPage &&
                <Link to={CONTACTS} onClick={handleDrawerClose}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><ContactsIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Contacts' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }


              {
                isSignedIn &&
                <Link to={ROOT}
                      onClick={async () => {
                        handleDrawerClose()
                        await auth.signOut()
                      }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><SignOutIcon color='primary' /></ListItemIcon>
                      <ListItemText primary='Sign out' sx={styles.drawerLink} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              }
            </List>
          </SwipeableDrawer>
        }

        <Toolbar sx={styles.toolbar}>
          <div className='d-flex w-100 align-items-center'>
            <Link to={ROOT}>
              <img src="img/logo.png" alt='' style={{ verticalAlign: 'initial' }} />
            </Link>

            <div style={{ flexGrow: 1 }} />

            <div className='d-flex justify-content-around' style={{ flexGrow: 3 }}>
              {
                !isSmallDevice &&
                <>

                  <a href={SCHEDULE} style={styles.menuItem}>
                    <div className='text-white d-flex align-items-center'>
                      <span className='mx-2 text-with-shadow'>SCHEDULE</span>
                    </div>
                  </a>
                  <Link to={ABOUT_US} style={styles.menuItem}>
                    <div className='text-white d-flex align-items-center'>
                      <span className='mx-2 text-with-shadow'>About Us</span>
                    </div>
                  </Link>
                  <Link to={FAQ} style={styles.menuItem}>
                    <div className='text-white d-flex align-items-center'>
                      <span className='mx-2 text-with-shadow'>FAQ</span>
                    </div>
                  </Link>
                </>
              }
              {
                !isSmallDevice && isMember &&
                <Link to={MEMBERS} style={styles.menuItem} /*style={{ marginLeft: '2em' }}*/>
                  <div className='text-white d-flex align-items-center'>
                    <span className='mx-2 text-with-shadow'>Members</span>
                  </div>
                </Link>
              }
            </div>

            <div style={{ flexGrow: 1.5 }} />
          </div>
          <div style={{ width: !isSignedOut ? '10em' : '20em' }}
               className='d-flex flex-row-reverse justify-content-between'>
            {
              isSmallDevice &&
              <IconButton edge="start" color="inherit" aria-label="Menu" onClick={() => setShowDrawer(!showDrawer)}>
                <MenuIcon fontSize="large" />
              </IconButton>
            }
            {
              !isSmallDevice && isSignedIn &&
              <Profile />
            }
            {
              !isSmallDevice && isSignedOut && pathname.trim() !== JOIN &&
              <Link to={{
                pathname: JOIN
              }}>
                <Button variant='contained' color='primary' className='ml-5 text-with-shadow'>
                  Join Us
                </Button>
              </Link>
            }
            {
              !isSmallDevice && isSignedOut &&
              <Link to={SIGN_IN} className='signin-btn text-white'>
                <Button className='text-white text-with-shadow'>
                  Sign in
                </Button>
              </Link>
            }
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

const mapStateToProps = ({ currentUser: { isCurrentUserLoaded, firebaseUser, permissions, userData } }: IRedisState) => {
  const userDataJS: IUser = userData ? userData.toJS() : undefined
  return {
    allowUsersPage: !firebaseUser ? false : !!(permissions.usersRead[firebaseUser.uid] || permissions.usersWrite[firebaseUser.uid]),
    allowContactsPage: !firebaseUser ? false : !!(permissions.contactsRead[firebaseUser.uid] || permissions.contactsWrite[firebaseUser.uid]),
    isMember: userData && calc(userDataJS).isAMember,
    isCurrentUserLoaded,
    firebaseUser
  }
}

export default connect(mapStateToProps)(Header)
