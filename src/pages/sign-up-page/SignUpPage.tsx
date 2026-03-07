import React, { useEffect, useState } from 'react'
import SignUpStepper, {
  STEP_AUTHENTICATION,
  STEP_MEMBERSHIP,
  STEP_USER_DETAILS
} from './SignUpStepper'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IRedisState } from '../../entities/User'
import { User } from '../../../functions/src/User'

interface Props {
  isCurrentUserLoaded: boolean
  firebaseUser: User
}

function SignUpPage({ isCurrentUserLoaded, firebaseUser }: Props) {
  const [steps, setSteps] = useState<string[]>()
  useEffect(() => {
    if (!isCurrentUserLoaded) {
      return
    }
    if (steps) {
      // num of steps already decided based on the user's state.
      return
    }
    if (firebaseUser) {
      setSteps([STEP_USER_DETAILS, STEP_MEMBERSHIP])
    } else {
      setSteps([STEP_AUTHENTICATION, STEP_USER_DETAILS, STEP_MEMBERSHIP])
    }
  }, [isCurrentUserLoaded, firebaseUser, steps])

  if (!isCurrentUserLoaded || !steps) {
    // todo: show loading
    return <></>
  }

  // When returning from Stripe checkout, skip directly to the Membership step
  const params = new URLSearchParams(window.location.search)
  const initialStep = params.get('session_id')
    ? Math.max(steps.indexOf(STEP_MEMBERSHIP), 0)
    : 0

  return (
    <div style={{ maxWidth: 350 }} className="mx-auto mt-4">
      <SignUpStepper steps={steps} initialStep={initialStep} />
    </div>
  )
}

SignUpPage.propTypes = {
  isCurrentUserLoaded: PropTypes.bool.isRequired,
  firebaseUser: PropTypes.object,
}

const mapStateToProps = ({ currentUser: { isCurrentUserLoaded, firebaseUser } }: IRedisState) => {
  return {
    isCurrentUserLoaded,
    firebaseUser
  }
}

// @ts-ignore
export default connect(mapStateToProps)(SignUpPage)
