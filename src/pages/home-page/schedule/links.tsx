import React from 'react'
import { MapLinkLeadingWrap } from './styles'

export const getMapLink = (eventElement: string) => {
  return (
    <MapLinkLeadingWrap>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.app.goo.gl/${eventElement}`}
      >
        <i className="fas fa-map-marker-alt" />
        &nbsp;Meeting Point
      </a>
    </MapLinkLeadingWrap>
  )
}

export const getFacebookEventLink = (eventElement: string) => {
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
