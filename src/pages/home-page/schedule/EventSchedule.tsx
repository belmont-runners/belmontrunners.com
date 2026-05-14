import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport)
import CalendarSelector from './CalendarSelector'
import ExpendMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'

import { firestore } from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'

import type { CSVEvent } from './types'
import { CITY_ID } from './constants'
import { eventImageLightboxSrc, eventImageSrc } from './utils'
import { getFacebookEventLink, getMapLink } from './links'
import {
  EventDetailsColumn,
  EventImageStripButton,
  EventImageStripImg,
  EventRow,
  ImageLightboxCloseButton,
  ImageLightboxContent,
  ImageLightboxDialog,
  ImageLightboxImg,
  MembersOnlyBadgeImg,
  RunnerIconImg,
  WeatherAside
} from './styles'

function EventSchedule() {
  const [events, setEvents] = useState<CSVEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CSVEvent[]>([])
  const [daysAhead, setDaysAhead] = useState(15)
  const [loadMoreClicked, setLoadMoreClicked] = useState(0)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

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

  const closeLightbox = () => setLightbox(null)

  return (
    <section className="event_schedule_area pad_btm">
      <ImageLightboxDialog
        open={Boolean(lightbox)}
        onClose={closeLightbox}
        maxWidth="lg"
        fullWidth
      >
        <ImageLightboxContent>
          <ImageLightboxCloseButton
            type="button"
            onClick={closeLightbox}
            aria-label="Close enlarged image"
          >
            <CloseIcon />
          </ImageLightboxCloseButton>
          {lightbox && (
            <ImageLightboxImg
              src={lightbox.src}
              alt={lightbox.alt}
              referrerPolicy="no-referrer"
            />
          )}
        </ImageLightboxContent>
      </ImageLightboxDialog>
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
              {filteredEvents.map((filteredEvent: CSVEvent, index) => {
                const imageSrc = eventImageSrc(filteredEvent)
                const lightboxSrc = eventImageLightboxSrc(filteredEvent)
                const eventImageAlt = `Image for ${filteredEvent.subject}`
                const openLightbox = () => {
                  if (lightboxSrc) {
                    setLightbox({ src: lightboxSrc, alt: eventImageAlt })
                  }
                }
                return (
                  <EventRow
                    key={index}
                    className="media d-flex flex-row align-items-stretch flex-nowrap"
                  >
                    <div className="d-flex flex-shrink-0 align-self-center">
                      <RunnerIconImg
                        src="img/schedule/schedule-3.png"
                        alt="Runner icon"
                        loading="lazy"
                      />
                    </div>
                    <EventDetailsColumn className="media-body flex-grow-1">
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
                    </EventDetailsColumn>
                    {imageSrc && lightboxSrc && (
                      <EventImageStripButton
                        type="button"
                        aria-label={`View larger image: ${filteredEvent.subject}`}
                        onClick={openLightbox}
                      >
                        <EventImageStripImg
                          src={imageSrc}
                          alt={eventImageAlt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </EventImageStripButton>
                    )}
                    <WeatherAside>
                      <div className="text-center">
                        {filteredEvent['is-members-only-event'] === 'TRUE' && (
                          <MembersOnlyBadgeImg
                            src="img/schedule/members-only-t.png"
                            alt="Members only"
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
                    </WeatherAside>
                  </EventRow>
                )
              })}
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
