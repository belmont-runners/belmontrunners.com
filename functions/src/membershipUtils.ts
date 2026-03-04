import dayjs from 'dayjs'

interface CalcParam {
  membershipExpiresAt?: string | null
}

interface CalcRes {
  isAMember: boolean
  wasNeverAMember: boolean
  isMembershipExpired: boolean
  isMembershipExpiresSoon: boolean
}

const MembershipUtils = (userData: CalcParam, durationAmount = 1, durationUnit: dayjs.ManipulateType = 'month'): CalcRes => {
  const membershipExpiresAt = userData.membershipExpiresAt
  const isAMember = membershipExpiresAt && dayjs().isBefore(dayjs(membershipExpiresAt))
  const isMembershipExpired = membershipExpiresAt && dayjs(membershipExpiresAt).isBefore(dayjs())
  return {
    isAMember: Boolean(isAMember),
    isMembershipExpiresSoon: (isAMember && membershipExpiresAt && dayjs(membershipExpiresAt).isBefore(dayjs().add(durationAmount, durationUnit))) || false,
    isMembershipExpired: Boolean(isMembershipExpired),
    wasNeverAMember: !isAMember && !isMembershipExpired
  }
}
export default MembershipUtils
