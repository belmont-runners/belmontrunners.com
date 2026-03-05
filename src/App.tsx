import { User } from 'firebase/auth'
import React, { useEffect } from 'react'
import Footer from './components/Footer'
import './App.css'
import './scss/style.scss'
import { IFetchCurrentUser, fetchCurrentUser as fetchCurrentUserAction } from './reducers/currentUser'
import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/sign-in-page/SignInPage'
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage'
import AboutUsPage from './pages/about-us-page/AboutUsPage'
import HomePage from './pages/home-page'
import Header from './components/Header'
import SignUpPage from './pages/sign-up-page/SignUpPage'
import {
  ACCOUNT,
  COMPLETE,
  CONTACTS,
  FAQ,
  FORGOT_PASSWORD,
  JOIN,
  ABOUT_US,
  MEMBERS,
  PROFILE,
  RECOVER_EMAIL,
  RESET_PASSWORD,
  ROOT,
  SIGN_IN,
  USERS,
  VERIFY_EMAIL
} from './urls'
import UsersPage from './pages/users-page/UsersPage'
import ResetPasswordPage from './pages/authentication/ResetPasswordPage'
import Complete from './pages/authentication/Complete'
import RecoverEmailPage from './pages/authentication/RecoverEmailPage'
import ContactsPage from './pages/contacts-page/ContactsPage'
import MyProfilePage from './pages/my-profile-page/MyProfilePage'
import VerifyEmailPage from './pages/authentication/VerifyEmailPage'
import MembersPage from './pages/members-page/MembersPage'
import usePrevious from './components/usePrevious'
import AccountPage from './pages/account-page/AccountPage'
import LogRocket from 'logrocket'
import FaqPage from './pages/faq-page/FaqPage'
import { IRedisState } from './entities/User'
import ErrorBoundary from './components/ErrorBoundary'

import setupLogRocketReact from 'logrocket-react'

interface WrapperProps {
  inHomePage?: boolean
  children?: any
}

function Wrapper(props: WrapperProps = {}) {
  return (
    <ErrorBoundary>
      <Header />
      {props.inHomePage && <HomePage />}
      {props.inHomePage && props.children}

      {!props.inHomePage && (
        <div className="mb-4 mx-1 mx-sm-2 mx-md-3"> {props.children} </div>
      )}
      <Footer />
    </ErrorBoundary>
  )
}

interface Props {
  fetchCurrentUser: IFetchCurrentUser
  firebaseUser: User
}

function App({ fetchCurrentUser, firebaseUser }: Props) {
  useEffect(() => {
    LogRocket.init('qv4xmc/belmont-runners')
    setupLogRocketReact(LogRocket)
    fetchCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prevFirebaseUser = usePrevious(firebaseUser)
  useEffect(() => {
    if (prevFirebaseUser !== firebaseUser) {
      console.log('currentUser is different:', firebaseUser)
      if (firebaseUser) {
        const userTraits = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || ''
        }
        LogRocket.identify(firebaseUser.uid, userTraits)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser])

  return (
    <>
      <Routes>
        <Route path={JOIN} element={<Wrapper><SignUpPage /></Wrapper>} />
        <Route path={PROFILE} element={<Wrapper><MyProfilePage /></Wrapper>} />
        <Route path={ACCOUNT} element={<Wrapper><AccountPage /></Wrapper>} />
        <Route path={ABOUT_US} element={<Wrapper><AboutUsPage /></Wrapper>} />
        <Route path={`${MEMBERS}/*`} element={<Wrapper><MembersPage /></Wrapper>} />
        <Route path={USERS} element={<Wrapper><UsersPage /></Wrapper>} />
        <Route path={CONTACTS} element={<Wrapper><ContactsPage /></Wrapper>} />
        <Route path={FAQ} element={<Wrapper><FaqPage /></Wrapper>} />
        <Route path={SIGN_IN} element={<Wrapper inHomePage><SignIn /></Wrapper>} />
        <Route path={FORGOT_PASSWORD} element={<Wrapper inHomePage><ForgotPasswordPage /></Wrapper>} />
        <Route path={COMPLETE} element={<Wrapper inHomePage><Complete /></Wrapper>} />
        <Route path={RESET_PASSWORD} element={<Wrapper inHomePage><ResetPasswordPage /></Wrapper>} />
        <Route path={RECOVER_EMAIL} element={<Wrapper inHomePage><RecoverEmailPage /></Wrapper>} />
        <Route path={VERIFY_EMAIL} element={<Wrapper inHomePage><VerifyEmailPage /></Wrapper>} />
        <Route path={ROOT} element={<Wrapper inHomePage />} />
      </Routes>
    </>
  )
}

const mapDispatchToProps = {
  fetchCurrentUser: fetchCurrentUserAction
}

const mapStateToProps = ({ currentUser: { firebaseUser } }: IRedisState) => {
  return {
    firebaseUser
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
// @ts-ignore
)(App)
