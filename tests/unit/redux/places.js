import {test} from 'tape'
import {selectPlaces} from 'redux/modules/places'

const plantings = Object.freeze(require('../../fixtures/plantings.json'))
const places = Object.freeze(require('../../fixtures/places.json'))
const plants = Object.freeze(require('../../fixtures/plants.json'))

const state = {plantings, places, plants}
const stateCopy = Object.freeze(Object.assign({}, state))

test('selectPlaces', function (t) {
  t.plan(2)
  t.equal(selectPlaces(state), state.places, 'should return places from the state object')
  t.deepEqual(stateCopy, state, 'should not mutate the state object')
})
