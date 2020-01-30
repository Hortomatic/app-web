import eventNames, {
  PLANT,
  TRANSPLANT
} from 'constants/plantingEvents.js'

import Plant from './Plant'
import Transplant from './Transplant'

export default {
  [PLANT]: Plant,
  [TRANSPLANT]: Transplant
}
