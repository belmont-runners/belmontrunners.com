import type { Dayjs } from 'dayjs'

export interface Weather {
  icon: string
  description: string
  temp: number
  wind: number
}

export interface CSVEvent {
  month: number
  moment: Dayjs
  'is-special-event': string
  subject: string
  what: string
  where: string
  'google-map-id'?: string
  'facebook-event-id'?: string
  'is-members-only-event'?: string
  'image-url'?: string
  weather: Weather
}
