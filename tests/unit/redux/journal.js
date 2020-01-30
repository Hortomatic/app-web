import {test} from 'tape'
import Immutable from 'immutable'
import moment from 'moment'

import {
  getEventDate, 
  getLatestTimelineDate
} from 'utils/plantings.js'

import {
  // action handlers
  handleSetActivePlanting,
  // selectors
  selectLogData
} from 'redux/modules/journal'

const plantings = require('../../fixtures/plantings.json')
const places = require('../../fixtures/places.json')
const plants = require('../../fixtures/plants.json')
const journal = {
  selectedPlantingId: 'planting/one'
}

const state = {plantings, places, plants, journal}
const stateCopy = Object.freeze(_.cloneDeep(state))

test('handleSetActivePlanting', function (t) {
    t.plan(3)

    const selectedPlantingId = 'planting/one'
    const action = {payload:{plantingId: selectedPlantingId}}
    const stateCopy = {...journal}

    const newState = handleSetActivePlanting(
      stateCopy,
      action
    )

    t.equal(newState && newState.selectedPlantingId, selectedPlantingId,
      'sets state.journal.selectedPlantingId to value of payload.plantingId'
    )

    t.throws(()=>handleSetActivePlanting(plantingsCopy),
      'throws error if payload doesn\'t contain plantingId'
    )

    t.deepEqual(stateCopy, journal, 
      'must not mutate state')

});

test.skip('selectLogData', function (t) {
    t.plan(7)

    const selectedPlantingId = 'planting/one'
    const _pl = plantings[selectedPlantingId]
    const _tl = _pl.timeline
    const stateCopy = {...state}

    const expectedData = {
      range: [
        moment(getEventDate(_pl.timeline[0])).startOf('month').toDate(),  
        moment(getEventDate(_.last(_pl.timeline))).endOf('month').toDate()
      ],
      months: [
        {
          month: moment(getEventDate(_pl.timeline[0])).startOf('month').toDate(),
          events: [
            _pl.timeline[0]
          ]
        },
        // timeline[2] is a lifecycle event so it's skipped
        {
          month: moment(getEventDate(_pl.timeline[1])).startOf('month').toDate(),
          events: [
            _pl.timeline[2]
          ]
        },
        // timeline[3] is a period event so it's skipped
        {
          month: moment(getEventDate(_pl.timeline[3])).startOf('month').toDate(),
          events: [
            _pl.timeline[4]
          ]
        }
      ]
    }

    let noSelectedPlantingState = _.cloneDeep(state)
    noSelectedPlantingState.journal.selectedPlantingId = undefined

    const logDataWithoutActivePlanting = selectLogData(noSelectedPlantingState)
    const logData = selectLogData(state)


    t.assert(state.journal.selectedPlantingId,
      'state has selectedPlantingId')

    t.equal( logDataWithoutActivePlanting, false,
      'returns false if there is no selected planting')

    t.deepEqual(logData.range, expectedData.range,
      'defines the start and end date range')

    t.assert(!!logData.months,
      'defines a months property')

    t.equal(logData.months.length, expectedData.months.length,
      'groups events by month')

    t.assert(
      logData.months[0].events.length === expectedData.months[0].events.length
        && logData.months[1].events.length === expectedData.months[1].events.length
        && logData.months[2].events.length === expectedData.months[2].events.length,
      'grabs all single-date events from timeline'
      )

    t.deepEqual(stateCopy, state, 
      'must not mutate state')

});