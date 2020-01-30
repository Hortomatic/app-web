import {test} from 'tape'
import {selectPlants} from 'redux/modules/plants'

const plantings = Object.freeze(require('../../fixtures/plantings.json'))
const places = Object.freeze(require('../../fixtures/places.json'))
const plants = Object.freeze(require('../../fixtures/plants.json'))

const state = {plantings, places, plants}
const stateCopy = Object.freeze(Object.assign({}, state))

test('selectPlants', function (t) {
  t.plan(2)
  t.equal(selectPlants(state), state.plants, 'should return plants from the state object')
  t.deepEqual(stateCopy, state, 'should not mutate the state object')
})
