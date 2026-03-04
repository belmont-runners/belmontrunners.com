import React, { useEffect, useState } from 'react'
import LoggedInState from '../../components/HOC/LoggedInState'
import { connect } from 'react-redux'
import MyProfileForm from './MyProfileForm'
import { animateScroll } from 'react-scroll'
import { compose } from 'underscore'
import { IRedisState } from '../../entities/User'
import { User } from 'firebase/auth'

interface Props {
  firebaseUser: User
}

function MyProfilePage({ firebaseUser }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    animateScroll.scrollToTop({ duration: 0 })
  }, [firebaseUser])

  const handleSubmissionChanged = (value: boolean) => {
    setIsSubmitting(value)
  }

  return (
    firebaseUser && (
      <div className="mx-auto py-5 px-3" style={{ maxWidth: 500 }}>
        <MyProfileForm
          onSubmitting={handleSubmissionChanged}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  )
}

const mapStateToProps = ({ currentUser: { firebaseUser } }: IRedisState) => {
  return {
    firebaseUser
  }
}

export default compose(
  LoggedInState(),
  connect(mapStateToProps)
)(MyProfilePage)
