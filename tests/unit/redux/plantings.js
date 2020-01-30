import {test} from 'tape'
// import Immutable from 'immutable'
import _ from 'lodash'

import cloneMap from 'utils/cloneMap'
import modelArrayToMap from 'utils/modelArrayToMap'

import {
  selectPlantings,
  selectTrashedPlantings,
  selectActivePlantings,
  handleSetPlanting,
  handleSetPlantingEvent,
  handleSetPlantingEventDate,
  handleUpdatePlanting,
  handleUpdatePlantingEvent
} from 'redux/modules/plantings'

const plantings = modelArrayToMap(require('../../fixtures/plantings.json'))
const places = modelArrayToMap(require('../../fixtures/places.json'))
const plants = modelArrayToMap(require('../../fixtures/plants.json'))

const state = {plantings, places, plants}
const stateCopy = Object.freeze(_.cloneDeep(state))

test('selectPlantings', function (t) {
  t.plan(3)
  const result = selectPlantings(state)
  t.equal(result, state.plantings,
    'returns plantings from the state object')
  t.assert(result instanceof Map,
    'returns a Map')
  t.deepEqual(stateCopy, state,
    'must not mutate the state object')
})
test('selectTrashedPlantings', function (t) {
  t.plan(3)
  const newPlantings = cloneMap(plantings)
  newPlantings.get('planting/one').isTrashed = true
  const testState = {
    plantings: newPlantings,
    places,
    plants
  }
  const testStateCopy = {
    ...testState,
    plantings: cloneMap(newPlantings)
  }
  const result = selectTrashedPlantings(testState)
  t.assert(result instanceof Map,
    'returns a Map')
  t.equal(result.size, 1,
    'returns only trashed plantings')
  t.deepEqual(testState, testStateCopy,
    'must not mutate the state object')
})
test('selectActivePlantings', function (t) {
  t.plan(3)

  const newPlantings = cloneMap(plantings)
  newPlantings.get('planting/one').isTrashed = true
  const testState = {
    plantings: newPlantings,
    places,
    plants
  }
  const testStateCopy = {
    ...testState,
    plantings: cloneMap(newPlantings)
  }
  const result = selectActivePlantings(testState)
  t.assert(result instanceof Map,
    'returns a Map')
  t.equal(result.size, 2,
    'should return only active plantings')
  t.deepEqual(testState, testStateCopy,
    'should not mutate the state object')
})

test('handleSetPlanting', function (t) {
  t.plan(2)
  const payload = {
    plantingId: 'planting/one',
    plantingData: {
      ...plantings.get('planting/one'),
      name: 'FooBar'
    }
  }
  const plantingsCopy = cloneMap(plantings)
  t.equal(
    handleSetPlanting(plantingsCopy, {payload}).get('planting/one'),
    payload.plantingData,
    'sets planting to value of `payload.plantingData`'
  )
  t.deepEqual(
    [...plantingsCopy.entries()],
    [...plantings.entries()],
    'must not mutate state')
})
test('handleSetPlantingEvent', function (t) {
    t.plan(2)

    const plantingId = 'planting/one'
    const eventIndex = 2
    const eventData = {
      ...plantings.get(plantingId).timeline[eventIndex],
      foo: 'bar2'
    }
    const payload = {plantingId, eventIndex, eventData}
    const plantingsCopy = cloneMap(plantings)
    const result = handleSetPlantingEvent(
      plantingsCopy,
      {payload}
    )
    t.deepEqual(
      result.get(plantingId).timeline[eventIndex],
      eventData,
      'replaces the timeline index with the given event data'
    )
    t.deepEqual(
      [...plantingsCopy.entries()],
      [...plantings.entries()],
      'must not mutate the state object')
})
test.skip('handleSetPlantingEventDate', function (t) {

})

test('handleUpdatePlanting', function (t) {
  t.plan(2)
  const plantingId = 'planting/one'
  const plantingsCopy = cloneMap(plantings)
  const originalPlantingData = {...plantingsCopy.get(plantingId)}
  const payload = {
    plantingId,
    plantingData: {
      name: 'FooBar'
    }
  }
  const expectedPlantingData = {
    ...originalPlantingData,
    ...payload.plantingData
  }
  const result = handleUpdatePlanting(plantingsCopy, {payload})
  t.deepEqual(result.get(plantingId), expectedPlantingData,
    'merges `payload.plantingData` over existing planting data')
  t.deepEqual(plantingsCopy, plantings,
    'must not mutate state')
})

test('handleUpdatePlantingEvent', function (t) {
  t.plan(2)
  const plantingId = 'planting/one'
  const eventIndex = 0
  const plantingsCopy = cloneMap(plantings)
  const originalPlantingData = {...plantingsCopy.get(plantingId)}
  const originalEventData = {...plantingsCopy.get(plantingId).timeline[eventIndex]}
  const payload = {
    plantingId,
    eventIndex,
    eventData: {
      name: 'FooBar'
    }
  }
  const expectedPlantingData = {
    ...originalPlantingData,
    timeline: [{...originalEventData, ...payload.eventData}]
      .concat(originalPlantingData.timeline.slice(1))
  }
  const result = handleUpdatePlantingEvent(plantingsCopy, {payload})
  t.deepEqual(result.get(plantingId), expectedPlantingData,
    'merges `payload.eventData` over specified timeline index')
  t.deepEqual(plantingsCopy, plantings,
    'must not mutate state')
})
