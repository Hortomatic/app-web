import {test} from 'tape'
import moment from 'moment'
import momentRange from 'moment-range'
import _ from 'lodash'

import cloneMap from 'utils/cloneMap'
import modelArrayToMap from 'utils/modelArrayToMap'

import {
  getPlanting,
  getPlantingName,
  getPlantingPlaceName,
  getPlantingPlantName,
  getEventDate,
  getEarliestEventDate,
  getLatestEventDate,
  getLatestTimelineDate,
  isEstimate,
  isEventDateRange,
  formatPlantingForTimeline,
  formatPlantingForLog,
  getPlaceIdFromTimeline
} from 'utils/plantings'

const plantings = modelArrayToMap(require('../../fixtures/plantings.json'))
const places = modelArrayToMap(require('../../fixtures/places.json'))
const plants = modelArrayToMap(require('../../fixtures/plants.json'))

const estimate = Object.freeze({
  eventDateType: 'day',
  eventType: 'activity',
  estimateDate: new Date('2015-01-01')
})

const actual = Object.freeze({
  eventDateType: 'day',
  eventType: 'activity',
  actualDate: new Date('2015-01-01')
})

const estimateRange = Object.freeze({
  eventDateType: 'range',
  eventType: 'activity',
  estimateDateRange: [new Date('2015-01-01'), new Date('2015-02-01')]
})

const actualRange = Object.freeze({
  eventDateType: 'range',
  eventType: 'activity',
  actualDateRange: [new Date('2015-01-01'), new Date('2015-02-01')]
})

test('getPlanting', function (t) {
  t.plan(1)
  const plantingId = 'planting/one'
  t.deepEqual(
    getPlanting(plantings, plantingId),
    plantings.get(plantingId),
    'returns planting with matching id'
  )
})
test('getPlantingName', function (t) {
  t.plan(1)
  const planting = plantings.get('planting/one')
  t.equal(getPlantingName(planting),
    planting.name,
    'returns planting name'
  )
})
test.skip('getPlantingPlaceName', function (t) {
  t.plan(1)
  const planting = plantings.get('planting/one')
  t.equal(getPlantingPlaceName(planting),
    '')
})
test.skip('getPlantingPlantName', function (t) {

})
test('getEventDate', function (t) {
  t.plan(6)

  t.equal(
    getEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getEventDate(estimateRange)[0].toString(),
    estimateRange.estimateDateRange[0].toString(),
    'returns start estimateRange date'
  )
  t.equal(
    getEventDate(estimateRange)[1].toString(),
    estimateRange.estimateDateRange[1].toString(),
    'returns end estimateRange date'
  )
  t.equal(
    getEventDate(actualRange)[0].toString(),
    actualRange.actualDateRange[0].toString(),
    'returns start actualRange date'
  )
  t.equal(
    getEventDate(actualRange)[1].toString(),
    actualRange.actualDateRange[1].toString(),
    'returns end actualRange date'
  )
})

test('getEarliestEventDate', function (t) {
  t.plan(4)

  t.equal(
    getEarliestEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getEarliestEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getEarliestEventDate(estimateRange).toString(),
    estimateRange.estimateDateRange[0].toString(),
    'returns start estimateRange date'
  )
  t.equal(
    getEarliestEventDate(actualRange).toString(),
    actualRange.actualDateRange[0].toString(),
    'returns start actualRange date'
  )
})

test('getLatestEventDate', function (t) {
  t.plan(4)

  t.equal(
    getLatestEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getLatestEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getLatestEventDate(estimateRange).toString(),
    estimateRange.estimateDateRange[1].toString(),
    'returns end estimateRange date'
  )
  t.equal(
    getLatestEventDate(actualRange).toString(),
    actualRange.actualDateRange[1].toString(),
    'returns end actualRange date'
  )
})

test('getLatestTimelineDate', function (t) {
  const timelineOne = [
    {
      eventDateType: 'day',
      actualDate: new Date('2014-01-01')
    },
    {
      eventDateType: 'day',
      estimateDate: new Date('2015-04-01')
    }
  ]
  const timelineTwo = [
    {
      eventDateType: 'day',
      estimateDate: new Date('2014-01-01')
    },
    {
      eventDateType: 'day',
      actualDate: new Date('2015-04-01')
    }
  ]
  const timelineThree = [
    {
      eventDateType: 'day',
      estimateDate: new Date('2014-01-01')
    },
    {
      eventDateType: 'range',
      estimateDateRange: [new Date('2014-04-01'), new Date('2015-01-01')]
    },
    {
      eventDateType: 'day',
      estimateDate: new Date('2014-08-01')
    }
  ]
  t.plan(3)

  t.equal(
    getLatestTimelineDate(timelineOne).toString(),
    timelineOne[1].estimateDate.toString(),
    'returns latest date'
  )
  t.equal(
    getLatestTimelineDate(timelineTwo).toString(),
    timelineTwo[1].actualDate.toString(),
    'returns latest date'
  )
  t.equal(
    getLatestTimelineDate(timelineThree).toString(),
    timelineThree[1].estimateDateRange[1].toString(),
    'returns end date of a range if its the latest date'
  )
})

test('isEstimate', function (t) {
  t.plan(6)

  t.equal(isEstimate(estimate), true,
    'returns true for an estimate date event')
  t.equal(isEstimate(actual), false,
    'returns false for an actual date event')
  t.equal(
    isEstimate({...estimate, ...actual}), false,
    'returns false for an actual date event, regardless of an estimate')
  t.equal(
    isEstimate(estimateRange), true,
    'returns true for an estimate date range event')
  t.equal(
    isEstimate(actualRange), false,
    'returns false for an actual date range event')
  t.equal(
    isEstimate({...estimateRange, ...actualRange}), false,
    'returns false for an actual date range event, regardless of an estimate range')
})

test('isEventDateRange', function (t) {
  t.plan(4)

  t.equal(isEventDateRange(estimateRange), true,
    'returns true for an estimate event range')
  t.equal(isEventDateRange(actualRange), true,
    'returns true fo an actual event range')
  t.equal(isEventDateRange(estimate), false,
    'returns false for an event whice is not a range')
  t.equal(isEventDateRange(actual), false,
    'returns false for an event whice is not a range')
})

const fixture = {
  "timeline": [
    {
      "eventDateType": "day",
      "eventType": "activity",
      "activityType": "plant",
      "actualDate": "2015-03-02T00:11:54.732Z",
      "plantId": "plant/one",
      "placeId": "place/one",
      "from": "seed",
      "notes": "Sowed thickly in a plastic fruit crate; next to stove until germination."
    },
    {
      "eventDateType": "day",
      "eventType": "lifecycle",
      "lifecycleStage": "germination",
      "actualDate": "2015-03-20T00:11:54.732Z",
      "from": "seed",
      "notes": "Lots came up."
    },
    {
      "estimateDateRange": ["2015-05-01", "2015-07-01"],
      "eventDateType": "range",
      "eventType": "activity",
      "activityType": "harvest"
    },
    {
      "estimateDate": "2015-11-08T01:35:26.514Z",
      "notes": "Transplanted out into modules",
      "eventDateType": "day",
      "eventType": "activity",
      "activityType": "remove",
      "placeId": "place/two"
    },
    {
      "estimateDate": "2015-12-08T01:35:26.514Z",
      "eventDateType": "day",
      "eventType": "end"
    }
  ],
  "name": "Avoa de Osedo",
  "plantId": "plant/one",
  "id": "planting/one",
  "type": "planting"
}

const fixtureCopy = _.cloneDeep(fixture)

test('getPlaceIdFromTimeline', function (t) {
  t.plan(2)

  t.equal(getPlaceIdFromTimeline(fixture.timeline), 'place/two',
    'returns the most recently defined place id in the timeline')
  t.deepEqual(fixture, fixtureCopy,
    'does not mutate data')
})

test('formatPlantingForTimeline', function (t) {
  t.plan(10)

  const expected = {
    placeId: 'place/two',
    plantId: 'plant/one',
    plantingId: 'planting/one',
    styles: {},
    name: 'Avoa de Osedo',
    from: new Date(fixture.timeline[0].actualDate),
    to: new Date(fixture.timeline[4].estimateDate),
    lines: [
      {
        appearance: 'solid',
        from: new Date(fixture.timeline[0].actualDate),
        to: new Date(fixture.timeline[4].estimateDate)
      }
    ],
    markers: [
      {...fixture.timeline[0], date: new Date(fixture.timeline[0].actualDate)},
      {...fixture.timeline[1], date: new Date(fixture.timeline[1].actualDate)},
      {...fixture.timeline[3], date: new Date(fixture.timeline[3].estimateDate)},
      {...fixture.timeline[4], date: new Date(fixture.timeline[4].estimateDate)}
    ],
    periods: [
      { ...fixture.timeline[2], from: new Date(fixture.timeline[2].estimateDateRange[0]), to: new Date(fixture.timeline[2].estimateDateRange[1]) }
    ]
  }
  const formatted = formatPlantingForTimeline(plants, places, fixture)

  t.deepEqual(fixture, fixtureCopy,
    'does not mutate data')

  // t.deepEqual(formatted, expected,
  //   'formats data as needed by Timeline component')

  t.equal(formatted.from.toString(), expected.from.toString(),
    'selects first timeline date as `from` property')
  t.equal(formatted.to.toString(), expected.to.toString(),
    'selects first timeline date as `to` property')
  t.equal(formatted.placeId, expected.placeId,
    'selects last defined `placeId` from timeline')
  t.equal(formatted.plantId, expected.plantId,
    'selects `plantId`')
  t.equal(formatted.plantingId, expected.plantingId,
    'selects `plantingId`')
  t.equal(formatted.name, expected.name,
    'selects `name`')
  t.equal(formatted.lines.length, expected.lines.length,
    'creates the correct number of lines')
  t.equal(formatted.markers.length, expected.markers.length,
    'creates the correct number of markers')
  t.equal(formatted.periods.length, expected.periods.length,
    'creates the correct number of periods')
})

test('formatPlantingForLog', function (t) {
  t.plan(3)

  const addPropsToEvent = function (ev, i) {
    return {
      ...ev,
      date: getEventDate(ev),
      id: i,
      indexInTimeline: i
    }
  }

  const expected = {
    dateRange: moment.range(moment('2015-03-01').startOf('month'), moment('2015-12-01').endOf('month')),
    monthEvents: {
      '2015 03': [
        addPropsToEvent(fixture.timeline[0], 0),
        addPropsToEvent(fixture.timeline[1], 1)
      ],
      '2015 11': [
        addPropsToEvent(fixture.timeline[3], 3)
      ],
      '2015 12': [
        addPropsToEvent(fixture.timeline[4], 4)
      ]
    }
  }

  const formatted = formatPlantingForLog(plants, places, fixture)

  t.deepEqual(fixture, fixtureCopy,
    'does not mutate data')
  t.assert(expected.dateRange.isSame(formatted.dateRange),
    'creates a date range spanning the full timeline, rounded to month start/end')
  t.deepEqual(formatted.monthEvents, expected.monthEvents,
    'groups events by month')
})
