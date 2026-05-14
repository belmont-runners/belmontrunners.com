import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport)
import CalendarSelector from './CalendarSelector'
import ExpendMoreIcon from '@mui/icons-material/ExpandMore'
import { useMediaQuery, useTheme, IconButton } from '@mui/material'

import { firestore } from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const CITY_ID = 5392423

const getMapLink = (eventElement: string) => {
  return (
    <span style={{ paddingRight: '1em' }}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.app.goo.gl/${eventElement}`}
      >
        <i className="fas fa-map-marker-alt" />
        &nbsp;Meeting Point
      </a>
    </span>
  )
}

const getFacebookEventLink = (eventElement: string) => {
  return (
    <span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/events/${eventElement}`}
      >
        <i className="fab fa-facebook-square" />
        &nbsp;Facebook Event
      </a>
    </span>
  )
}

interface Weather {
  icon: string
  description: string
  temp: number
  wind: number
}

interface CSVEvent {
  month: number
  moment: Dayjs,
  'is-special-event': string,
  subject: string,
  what: string,
  where: string,
  'google-map-id'?: string
  'facebook-event-id'?: string
  'is-members-only-event'?: string
  'image-url'?: string
  weather: Weather
}

const eventImageSrc = (event: CSVEvent): string | undefined => {
  const url = event['image-url']?.trim()
  return url || undefined
}

function EventSchedule() {
  const [events, setEvents] = useState<CSVEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CSVEvent[]>([])
  const [daysAhead, setDaysAhead] = useState(15)
  const [loadMoreClicked, setLoadMoreClicked] = useState(0)

  const fetchEventsFromFirestore = async () => {
    const eventsRef = doc(firestore, 'events/items')
    const eventsDoc = await getDoc(eventsRef)
    return eventsDoc.data() as { values: CSVEvent[] } | undefined
  }

  useEffect(() => {
    ;(async function () {
      const payload = await fetchEventsFromFirestore()
      const list = payload?.values ?? []
      list.forEach((event: CSVEvent) => {
        event.moment = dayjs(event)
      })
      setEvents(list)
    })()
  }, [])

  useEffect(() => {
    if (!events.length) {
      return
    }
    const res = events.filter((event: { moment: Dayjs }) => {
      return event.moment.isBefore(dayjs().add(daysAhead, 'day'))
    })
    setFilteredEvents(res)
  }, [events, daysAhead])

  const theme = useTheme()
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <section className="event_schedule_area pad_btm">
      <div className="container">
        <div className="main_title">
          <h2>Upcoming Events</h2>
        </div>
        <div className="d-flex flex-row-reverse mb-3">
          <CalendarSelector />
        </div>
        <div className="event_schedule_inner">
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              {
                filteredEvents.map(
                  (filteredEvent: CSVEvent, index) => {
                    const imageSrc = eventImageSrc(filteredEvent)
                    const eventImageAlt = imageSrc
                      ? `Image for ${filteredEvent.subject}`
                      : 'Runner icon'
                    return (
                      <div
                        key={index}
                        className={
                          isSmallDevice && imageSrc
                            ? 'media flex-column align-items-stretch'
                            : 'media align-items-center'
                        }
                      >
                        {isSmallDevice && imageSrc && (
                          <div className="w-100 mb-3">
                            <img
                              className="rounded"
                              src={imageSrc}
                              alt={eventImageAlt}
                              loading="lazy"
                              style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        {!isSmallDevice && (
                          <div className="d-flex flex-shrink-0 me-3 align-self-start">
                            <img
                              src={imageSrc || 'img/schedule/schedule-3.png'}
                              alt={eventImageAlt}
                              loading="lazy"
                              style={
                                imageSrc
                                  ? { width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }
                                  : undefined
                              }
                            />
                          </div>
                        )}
                        <div className="media-body">
                          <h5>{filteredEvent.moment.format('MMMM D h:mm a')}</h5>
                          <h4
                            className={
                              filteredEvent['is-special-event'] === 'TRUE'
                                ? 'special-event'
                                : undefined
                            }
                          >
                            {filteredEvent.moment.format('dddd')}{' '}
                            {filteredEvent.subject}
                          </h4>
                          <p>What: {filteredEvent.what}</p>
                          <p>Where: {filteredEvent.where}</p>
                          {filteredEvent['google-map-id'] ||
                          filteredEvent['facebook-event-id'] ? (
                            <div className="d-flex flex-wrap">
                              {filteredEvent['google-map-id'] &&
                              getMapLink(filteredEvent['google-map-id'])}
                              {filteredEvent['facebook-event-id'] &&
                              getFacebookEventLink(
                                filteredEvent['facebook-event-id']
                              )}
                            </div>
                          ) : (
                            <span />
                          )}
                        </div>
                        <div style={{ minWidth:90 }}>
                          <div className='text-center'>
                            {filteredEvent['is-members-only-event'] === 'TRUE' && (
                              <img
                                src="img/schedule/members-only-t.png"
                                alt="Members only"
                                style={{ width: '5em' }}
                              />
                            )}
                          </div>
                          <div className="text-center">
                            {filteredEvent.weather && (
                              <a
                                className="flex-d flex-row align-content-center"
                                target="_blank"
                                rel="noreferrer noopener"
                                href={`https://openweathermap.org/city/${CITY_ID}`}
                              >
                                <img
                                  alt="weather icon"
                                  src={`https://openweathermap.org/img/wn/${filteredEvent.weather.icon}.png`}
                                />
                                <div className="text-muted">
                                  {filteredEvent.weather.description}
                                </div>
                                <div className="weather-temp">
                                  {Math.round(filteredEvent.weather.temp)} °F
                                </div>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                )
              }
            </div>
          </div>
        </div>
        {loadMoreClicked <= 2 && filteredEvents.length < events.length && (
          <div className="d-flex justify-content-center bounce">
            <IconButton
              onClick={() => {
                setLoadMoreClicked(loadMoreClicked + 1)
                setDaysAhead(daysAhead + 7)
              }}
            >
              <ExpendMoreIcon />
            </IconButton>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventSchedule
