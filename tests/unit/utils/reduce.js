import {test} from 'tape'

import {earliest, latest} from 'utils/reduce'

const dates = [
  new Date('2014-01-01'),
  new Date('2015-01-01'),
  new Date('2016-01-01')
]

test('earlist', function (t) {
  t.plan(1)
  t.equal(dates.reduce(earliest), dates[0],
    'returns the earliest of an array of dates')
})

test('latest', function (t) {
  t.plan(1)
  t.equal(dates.reduce(latest), dates[2],
    'returns the latest of an array of dates')
})
