import eventNames, {
  PLANT,
  TRANSPLANT,
  HARVEST
} from 'constants/plantingEvents.js'

export default {
  [PLANT]: require('./plant-24.svg'),
  [TRANSPLANT]: require('./transplant-24.svg'),
  [HARVEST]: require('./harvest-24.svg')
}
