import * as Admin from 'firebase-admin'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import got from 'got'

dayjs.extend(isBetween)

const csv = require('csvtojson')
const request = require('request')

const SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1FZOB291KWLoutpr0s6VeK5EtvuiQ8uhe497nOmWoqPA/export?format=csv&usp=sharing'

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
  weather: Weather

}

interface RawWeather {
  dt: number
  main: {
    temp: number
  }
  weather: [
    {
      description: string
      icon: string
    }
  ]
  wind: {
    speed: number
  }
}

const getEvents = async (): Promise<CSVEvent[]> => {
  const rawEvents = await csv().fromStream(request.get(SPREADSHEET_URL))

  return rawEvents
    .map((event: CSVEvent) => {
      event.month--
      return event
    })
    .filter((event: CSVEvent) => {
      const dayjsEvent = dayjs(event as any)
      return (
        dayjsEvent.isValid() &&
        dayjsEvent.isAfter(dayjs().subtract(1, 'day'))
      )
    })
    .sort((a: CSVEvent, b: CSVEvent) => {
      const dayjsA = dayjs(a as any)
      const dayjsB = dayjs(b as any)
      return dayjsA.valueOf() - dayjsB.valueOf()
    })
}

const getRawWeather = async (appId: string, cityId: string): Promise<RawWeather[]> => {
  type OpenWeatherMapResponse = { list: RawWeather[] };
  const res = await got.get(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${appId}&units=imperial`).json()
  const data = res as OpenWeatherMapResponse
  return data.list
}

const UpdateEvents = (admin: Admin.app.App, appId: string, cityId: string) => {
  const firestore = admin.firestore()

  return async () => {
    const events = await getEvents()
    let rawWeather: RawWeather[] = []
    try {
      rawWeather = await getRawWeather(appId, cityId)
    } catch (err) {
      console.error('while fetching weather.  err:', err)
    }

    events.forEach((event: CSVEvent) => {
      rawWeather.find((currEntry: RawWeather, index: number) => {
        const currDT = dayjs.unix(currEntry.dt)
        const currTemp = currEntry.main.temp
        let nextDT
        let nextTemp
        const nextEntry: RawWeather = rawWeather[index + 1]
        if (nextEntry) {
          nextDT = dayjs.unix(nextEntry.dt)
          nextTemp = nextEntry.main.temp
        } else {
          nextDT = dayjs(currDT).add(3, 'hour')
          nextTemp = currTemp
        }
        const isInRange = dayjs(event as any).isBetween(
          currDT,
          nextDT,
          undefined,
          '[)'
        )
        if (isInRange) {
          event.weather = {
            description: currEntry.weather[0].description,
            icon: currEntry.weather[0].icon,
            temp:
              currTemp +
              ((nextTemp - currTemp) / (nextDT.unix() - currDT.unix())) *
              (dayjs(event as any).unix() - currDT.unix()),
            wind: currEntry.wind.speed
          }
          return true
        }
        return false
      })
    })
    if (!events.length) {
      return
    }

    await firestore.collection('events').doc('items').set({ values: events })
  }
}

export default UpdateEvents
