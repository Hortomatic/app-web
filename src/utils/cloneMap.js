import _ from 'lodash'

export default function cloneMap (map) {
  if (!(map instanceof Map)) {
    throw Error('cloneMap expects a Map object')
  }
  return new Map(_.cloneDeep([...map.entries()]))
}
