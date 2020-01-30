import _ from 'lodash'

export default function createGetStyle (styles) {
  // allow partial application with styles object
  return _.memoize(function getStyle (key, states = {}) {
    console.log('missed cache for', key, states)
    let merged = {...styles[key]}
    for (let state in states) {
      if (states[state] && styles[state]) {
        Object.assign(merged, styles[state][key])
      }
    }
    return merged
  }, (key, state) => {
    // let id = [..._.keys(state), ..._.values(state)].join('.')
    let k = `${key}.${JSON.stringify(state)}`
    return k
  })
}
