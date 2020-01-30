import _ from 'lodash'
import moment from 'moment'
import momentRange from 'moment-range' // used as moment.range

import {getPlace, getPlaceName} from './places'
import {getPlant, getPlantName} from './plants'
import {earliest, latest} from './reduce'
import eventIcons from 'components/TimelineIcons'

// import {
//   PLANT,
//   TRANSPLANT,
//   HARVEST
// } from 'constants/plantingEvents'

export function getPlanting (plantings, plantingId) {
  if (!plantings instanceof Map) {
    throw Error('Expected `plantings` to be instance of Map')
  }
  return plantings.get(plantingId)
}
export function getPlantingName (planting) {
  return planting.name
}
export function getPlantingPlaceName (planting) {
  return planting.place
    ? getPlaceName(planting.place)
    : ''
}
export function getPlantingPlantName (planting) {
  return getPlantName(planting.plant)
}
export function getEventIcon (event) {
  return eventIcons[event.activityType || event.lifecycleStage] || undefined
}

export const getEventAtIndex = function (planting, eventIndex) {
  return planting.timeline[eventIndex]
}

export function coerceToDate (date) {
  return date instanceof Date ? date : new Date(date)
}

// return the date of a planting event, not caring whether it's
// an estimate of an actual date
// returns a Date object or an Array of Date objects for a date range
export function getEventDate (event) {
  return isEventDateRange(event)
    ? (event.actualDateRange || event.estimateDateRange).map(coerceToDate)
    : coerceToDate(event.actualDate || event.estimateDate)
}

// get the earliest date for an event
// returns a Date object
export function getEarliestEventDate (event) {
  return isEventDateRange(event)
    ? getEventDate(event)[0]
    : getEventDate(event)
}

// get the latest defined date for an event
// returns a Date object
export function getLatestEventDate (event) {
  return isEventDateRange(event)
    ? getEventDate(event)[1]
    : getEventDate(event)
}

// get the latest date from a timeline of Planting Events
// returns a Date object
export function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestEventDate(event)).reduce(latest)
}
// get the earliest e date from a timeline of Planting Events
// returns a Date object
export function getEarliestTimelineDate (timeline) {
  return timeline.map(event => getEarliestEventDate(event)).reduce(earliest)
}

// check whether an event is an estimate or actual
export function isEstimate (event) {
  return !(event.actualDate || event.actualDateRange)
}

export function isEventDateRange (event) {
  return (
    event.eventDateType === 'range'
  )
}

export function orderTimelineByDate (events) {
  return events.sort((a, b) => {
    return getEarliestEventDate(a) > getEarliestEventDate(b)
      ? 1
        : getEarliestEventDate(a) < getEarliestEventDate(b)
          ? -1
          : 0
  })
}

export function getPlaceIdFromTimeline (timeline) {
  return (
    timeline &&
    timeline.length &&
    timeline.reduceRight((placeId, ev) => placeId || ev.placeId, undefined)
  )
}

function addLine (lines = [], line) {
  // extend the previous line if the new line is of the same type
  lines.length
    ? _.last(lines).appearance === line.appearance
      ? lines[lines.length - 1] = {..._.last(lines), to: line.to}
      : lines.push(line)
    : lines.push(line)

  return lines
}

// transform planting data to the format the Timeline compenent expects
export function formatPlantingForTimeline (plants, places, planting) {
  const {name, id, plantId, timeline} = planting

  let track = {
    from: getEarliestTimelineDate(timeline),
    to: getLatestTimelineDate(timeline),
    plantingId: id,
    placeId: getPlaceIdFromTimeline(timeline),
    plantId,
    name,
    lines: timeline.reduce((accum, ev) => {
      // for the first item, just add previousEvent and return
      if (accum.previousEvent === undefined) {
        accum.previousEvent = ev
        // return accum
      }

      let earliestDate = getEarliestEventDate(ev)
      let latestDate = getLatestEventDate(ev)
      let eventIsEstimate = isEstimate(ev)
      let eventIsRange = isEventDateRange(ev)

      // 2 types of line to be drawn here...
      // - a line between the two dates of a range event
      // - a line from the previous event to the start of current event

      if (accum.previousEvent) {
        let previousEventDate = getLatestEventDate(accum.previousEvent)
        // draw a line from the previous event to this one...
        addLine(accum.lines, {
          from: previousEventDate,
          to: earliestDate,
          appearance: 'solid'
        })
      }

      // if the event is a range/period, draw a line between the two dates
      if (eventIsRange) {
        if (ev.estimateDateRange[1] === undefined) {
          // addLine(accum.lines, {
          //   from: earliestDate,
          //   to: latestDate,
          //   appearance: eventIsEstimate ? 'dashed' : 'solid'
          // })
        } else {
          addLine(accum.lines, {
            from: earliestDate,
            to: latestDate,
            appearance: 'solid' //eventIsEstimate ? 'dashed' : 'solid'
          })
        }
      }

      accum.previousEvent = ev

      return accum
    }, {
      lines: [],
      previousEvent: undefined
    }).lines,
    markers: timeline
      // TODO squash this into a single reduce
      .map((e, eventIndex) => ({...e, eventIndex}))
      .filter(e => e.eventDateType === 'day')
      .map(e => ({
        ...e,
        date: getEventDate(e),
        icon: getEventIcon(e)
      })
    ),
    periods: timeline
      // TODO squash this into a single reduce
      .map((e, eventIndex) => ({...e, eventIndex}))
      .filter(isEventDateRange)
      .map(e => ({
        ...e,
        from: getEarliestEventDate(e),
        to: getLatestEventDate(e)
      })
    ),
    styles: {}
  }

  if (plants.get(track.plantId).appTheme) {
    track.styles.all = {
      stroke: plants.get(track.plantId).appTheme.timelineColor,
      fill: plants.get(track.plantId).appTheme.timelineColor
    }
  }

  if (_.last(timeline).eventType !== 'end') {
    let undefinedEndDate = moment(getLatestTimelineDate(timeline)).add(1, 'month').toDate()
    track.markers.push({
      date: undefinedEndDate,
      appearance: 'rightArrow'
    })
    track.lines.push({
      from: getLatestEventDate(_.last(timeline)),
      to: undefinedEndDate,
      appearance: 'dashed'
    })
  }

  return track
}

export function formatPlantingForLog (plants, places, planting) {
  const timeline = orderTimelineByDate(planting.timeline)

  const dateRange = moment.range(
    moment(getEarliestTimelineDate(timeline)).startOf('month'),
    moment(getLatestTimelineDate(timeline)).endOf('month')
  )

  // const activeEvents = events.filter(ev=>ev.get('status')!==EVENT_STATUSES.TRASHED);
  const monthEvents = _(timeline)
    .map((ev, i) => ({
      ...ev,
      date: getEventDate(ev),
      indexInTimeline: i,
      id: ev.id || i,
      placeName: ev.placeId && getPlaceName(getPlace(places, ev.placeId))
    }))
    .filter(ev => ev.eventDateType !== 'range')
    .groupBy(ev => moment(getEarliestEventDate(ev)).format('YYYY MM'))
    .value()

  return {
    dateRange,
    monthEvents
  }
}
