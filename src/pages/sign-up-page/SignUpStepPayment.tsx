import { functions } from '../../firebase'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import SignUpStepperButton from './SignUpStepperButton'
import * as PropTypes from 'prop-types'
import LoggedInState from '../../components/HOC/LoggedInState'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import { ROOT } from '../../urls'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UpdateUserData from '../../components/HOC/UpdateUserData'
import { animateScroll } from 'react-scroll'
import { compose } from 'underscore'
import calc from '../../utilities/membershipUtils'
import { IRedisState, IUser } from '../../entities/User'
import { IUpdateUserData } from '../../reducers/currentUser'
import { User } from '../../../functions/src/User';
import { FunctionsError, httpsCallable } from 'firebase/functions'

const MEMBERSHIP_FEE_ADULT = 20
const MEMBERSHIP_FEE_KID = 10

interface Props {
  firebaseUser: User
  needToPay: boolean
  totalAmount: number
  isLast: boolean
  onNextClicked: () => void
  youngerThan13: boolean
  membershipExpiresAt?: string
  updateUserData: IUpdateUserData
}

function SignUpStepPayment({
                             firebaseUser: { displayName, uid, email },
                             isLast,
                             needToPay,
                             totalAmount,
                             membershipExpiresAt,
                             onNextClicked,
                             youngerThan13,
                             updateUserData
                           }: Props) {
  const navigate = useNavigate()
  useEffect(() => {
    animateScroll.scrollToTop({ duration: 0 })
  }, [])

  const [errorMessage, setErrorMessage] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState('')
  const [checkoutMounted, setCheckoutMounted] = useState(false)
  const checkoutRef = useRef<any>(null)
  const checkoutContainerRef = useRef<HTMLDivElement>(null)

  // Clean up embedded checkout on unmount
  useEffect(() => {
    return () => {
      if (checkoutRef.current) {
        checkoutRef.current.destroy()
      }
    }
  }, [])

  // Handle return from embedded checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    if (!sessionId) return

    // Clean URL
    window.history.replaceState({}, '', window.location.pathname)

    ;(async function () {
      setIsSubmitting(true)
      try {
        const confirmFn = httpsCallable(functions, 'confirmCheckoutSession')
        const response = await confirmFn({
          sessionId,
          origin: window.origin
        })
        const data = response.data as { confirmationNumber: string }
        setConfirmationNumber(data.confirmationNumber)
      } catch (error) {
        console.warn('Error confirming checkout session:', error)
        const funcError = error as FunctionsError
        if (funcError.message) {
          setErrorMessage(funcError.message)
        } else {
          setErrorMessage(
            'Your payment was processed successfully, but we encountered an error updating your membership. ' +
            'Please contact membership@belmontrunners.com and we will resolve this promptly.'
          )
        }
      } finally {
        setIsSubmitting(false)
      }
    })()
  }, [])

  // Refresh user data after confirmation
  useEffect(() => {
    if (!confirmationNumber) return
    ;(async function () {
      await updateUserData({}, { merge: true })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmationNumber])

  const handleStartCheckout = useCallback(async () => {
    if (checkoutMounted) return
    setIsSubmitting(true)
    setErrorMessage(undefined)

    try {
      const createSessionFn = httpsCallable(functions, 'createCheckoutSession')
      const response = await createSessionFn({
        amountInCents: totalAmount * 100,
        description: `Annual membership for Belmont Runners. name: ${displayName} email: ${email} uid: ${uid}`,
        origin: window.origin,
        returnUrl: `${window.origin}/join?session_id={CHECKOUT_SESSION_ID}`,
        customerEmail: email
      })
      const data = response.data as { clientSecret: string }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      if (!stripe) {
        setErrorMessage('Failed to load Stripe. Please refresh and try again.')
        return
      }

      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret,
      })
      checkoutRef.current = checkout

      if (checkoutContainerRef.current) {
        checkout.mount(checkoutContainerRef.current)
        setCheckoutMounted(true)
      }
    } catch (error) {
      console.warn('Error creating checkout session:', error)
      const funcError = error as FunctionsError
      if (funcError.message) {
        try {
          const parsed = JSON.parse(funcError.message)
          setErrorMessage(parsed.message || parsed.code || 'Failed to start payment.')
        } catch {
          setErrorMessage(funcError.message)
        }
      } else {
        setErrorMessage('Failed to start payment. Please try again.')
      }
    } finally {
      if (!checkoutMounted) {
        setIsSubmitting(false)
      }
    }
  }, [checkoutMounted, totalAmount, displayName, email, uid])

  const getBody = () => {
    if (confirmationNumber) {
      return (
        <div className="text-success text-center mt-4">
          <div>
            <div>Complete successfully</div>
            <div>Confirmation: {confirmationNumber.substring(3)}</div>
          </div>
        </div>
      )
    }

    if (!needToPay) {
      if (youngerThan13) {
        return (
            <>
              <div className="text-justify mt-4">
                <p className="text-danger">
                  Kids 12 and under are welcome to join the club, as long as
                  they are accompanied by an Adult or Legal Guardian. However,
                  due to the California CCPA and COPPA, the club cannot allow
                  minors under 13 to register with our website.
                </p>
                <p>
                  If you and your child would like to join us on a run, please
                  talk to one of the Board Members or Run Leaders at a group run
                  in order to sign the liability waiver in person.
                </p>
                <p>
                  In order to keep your child&apos;s information safe, this account
                  will be automatically disabled within 24 hours.
                </p>
                <p>
                  Any questions, don&apos;t hesitate to contact us at <a
                    href='mailto://info@belmontrunners.com'
                    target='_blank'
                    rel='noreferrer noopener'>info@belmontrunners.com</a>.
                </p>
              </div>
            </>
        )
      }

      return (
        <>
          <div className="text-success text-center mt-4">
            Your membership expires on{' '}
            {dayjs(membershipExpiresAt).format('MMMM Do YYYY')}
          </div>
          <div className="text-success text-center">
            You can renew it after{' '}
            {dayjs(membershipExpiresAt)
              .subtract(1, 'month')
              .format('MMMM Do YYYY')}
          </div>
        </>
      )
    }

    // need to pay
    if (checkoutMounted) {
      return (
        <>
          <div ref={checkoutContainerRef} className="mt-3" />
          {errorMessage && (
            <div className="text-danger text-center mt-2">{errorMessage}</div>
          )}
        </>
      )
    }

    return (
      <>
        <h6 className="mt-3">Membership fees</h6>
        &bull; Adult (18 and over): $20
        <br />
        &bull; Kids: $10.
        <br />
        <h4 className="my-4">
          Total amount: ${totalAmount > 0 ? totalAmount : ''}
        </h4>
        {membershipExpiresAt && (
          <div className="text-success mb-3 text-center">
            {dayjs(membershipExpiresAt).isAfter(dayjs())
              ? `Your current membership expires on ${dayjs(membershipExpiresAt).format(
                'MMMM Do YYYY'
              )}`
              : `Your membership expired on ${dayjs(membershipExpiresAt).format(
                'MMMM Do YYYY'
              )}`}
          </div>
        )}
        {errorMessage && (
          <div className="text-danger text-center">{errorMessage}</div>
        )}
      </>
    )
  }

  console.log('SignUpStepPayment.render() called.')

  const handleClose = () => {
    navigate(ROOT)
  }

  function handleNextClicked() {
    if (confirmationNumber || !needToPay) {
      onNextClicked()
    } else {
      handleStartCheckout()
    }
  }

  return (
    <div className="justify-content-center">
      <h5 className="mt-5">Benefits to being part of Belmont Runners</h5>
      &bull; Training at group runs and walks
      <br />
      &bull; Free or discounted workshops, clinics, and classes
      <br />
      &bull; Discounted entry to other local races
      <br />
      &bull; Membership with the Road Runners Club of America
      <br />
      &bull; Liability insurance coverage
      <br />
      &bull; Social events with fun, active local runners and walkers
      <br />
      &bull; 10% discount at{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://arunnersmind.com"
      >
        A Runner's Mind
      </a>
      <br />
      {getBody()}
      {!checkoutMounted && (
        <SignUpStepperButton
          handlePrimaryClicked={handleNextClicked}
          primaryText={
            confirmationNumber || !needToPay
              ? isLast
              ? 'Finish'
              : 'Next'
              : isSubmitting ? 'Loading checkout...' : 'Pay Now'
          }
          primaryDisabled={isSubmitting}
          showPrimary
          handleSecondaryClicked={handleClose}
          secondaryText={'Finish later'}
          secondaryDisabled={isSubmitting}
          showSecondary={needToPay && !confirmationNumber}
        />
      )}
      {
        isSubmitting && !checkoutMounted && (<div className='text-center text-danger'>
          <div>Please wait...</div>
        </div>)
      }
    </div>
  )
}

SignUpStepPayment.propTypes = {
  // from redux
  firebaseUser: PropTypes.object.isRequired,
  updateUserData: PropTypes.func.isRequired,
  needToPay: PropTypes.bool,
  membershipExpiresAt: PropTypes.string,
  totalAmount: PropTypes.number.isRequired,
  youngerThan13: PropTypes.bool.isRequired,

  // from parent
  isLast: PropTypes.bool,
  onNextClicked: PropTypes.func.isRequired,

}

const mapStateToProps = ({ currentUser: { firebaseUser, userData } }: IRedisState) => {
  const userDataJS: IUser = userData ? userData.toJS() : {}
  let membershipExpiresAt = null
  let needToPay = false
  let totalAmount = -1
  let youngerThan13 = false

  if (firebaseUser) {
    if (!userDataJS.dateOfBirth) {
      console.error('missing userDataJS.dateOfBirth')
      totalAmount = MEMBERSHIP_FEE_ADULT
    } else {
      const dateOfBirth = dayjs(userDataJS.dateOfBirth)
      const isAdult = dayjs().diff(dateOfBirth, 'years') >= 18
      if (isAdult) {
        totalAmount = MEMBERSHIP_FEE_ADULT
      } else {
        totalAmount = MEMBERSHIP_FEE_KID
      }
    }
    const membershipData = calc(userDataJS)
    membershipExpiresAt = userDataJS.membershipExpiresAt
    if (
      !membershipData.isAMember ||
      membershipData.isMembershipExpiresSoon
    ) {
      needToPay = true
    }
    youngerThan13 =
      (userDataJS.dateOfBirth &&
        dayjs().diff(dayjs(userDataJS.dateOfBirth), 'years') < 13) ||
      false
    if (youngerThan13) {
      needToPay = false
    }
  }

  return {
    firebaseUser,

    needToPay,
    membershipExpiresAt,
    totalAmount,

    youngerThan13
  }
}

export default compose(
  UpdateUserData,
  LoggedInState(),
  connect(mapStateToProps)
)(SignUpStepPayment)
