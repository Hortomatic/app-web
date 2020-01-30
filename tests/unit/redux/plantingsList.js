import {test} from 'tape'
import _ from 'lodash'

import {
  selectViewState
} from 'redux/modules/plantingsList'

const plantings = require('../../fixtures/plantings.json')
const places = require('../../fixtures/places.json')
const plants = require('../../fixtures/plants.json')

const state = {plantings, places, plants}
const stateCopy = Object.freeze(_.cloneDeep(state))

test('selectViewState', function (t) {
  t.plan(2)

  const viewState = {
    selectedPlantingId: 'planting/one',
    selectedEventIndex: 2,
    isEditingEvent: true
  }

  const viewStateCopy = {...viewState}

  t.deepEqual(selectViewState({plantingsList: viewState}), viewState,
    'returns view state from `plantingsList` property')
  t.deepEqual(viewState, viewStateCopy, 'should not mutate the state object')
})
