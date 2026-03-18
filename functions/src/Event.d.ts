interface Event {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  subject: string
  where: string
  what: string
  'facebook-event-id'?: string
  'google-map-id'?: string
  'is-members-only-event': string
}

export default Event
