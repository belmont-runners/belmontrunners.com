import React from 'react'
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'

const MAP_CENTER = { lat: 37.5214784, lng: -122.26 }

if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  console.error('Missing VITE_GOOGLE_MAPS_API_KEY')
}

function MapComponent() {
  return (
    <section className="home_map_area">
      <div id="mapBox2" className="mapBox2">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'KEY_NOT_FOUND'}>
          <GoogleMap
            defaultCenter={MAP_CENTER}
            defaultZoom={14}
            scrollwheel={false}
            mapTypeControl={false}
            scaleControl={false}
            gestureHandling="none"
            streetViewControl={false}
            zoomControl={false}
            fullscreenControl={false}
            style={{ width: '100%', height: '100%' }}
          />
        </APIProvider>
      </div>

      <div className="home_details">
        <div className="container">
          <div className="box_home_details">
            <div className="media">
              <div className="d-flex">
                <i className="lnr lnr-envelope" />
              </div>
              <div className="media-body">
                <h4>
                  <a
                      href='mailto:info@belmontrunners.com'
                      target='_blank'
                      rel='noreferrer noopener'>info@belmontrunners.com</a>
                </h4>
                <p>Send us your query anytime!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapComponent
