import {
  PLANT,
  TRANSPLANT,
  actionEventNames,
  lifecycleEventNames
} from 'constants/plantingEvents'

import PlantEvent from './Plant'
import TransplantEvent from './Transplant'
import GenericEvent from './Generic'

export const eventComponents = {
  [PLANT]: PlantEvent,
  [TRANSPLANT]: TransplantEvent,
  Generic: GenericEvent
}

export {actionEventNames as actionEventNames}
export {lifecycleEventNames as lifecycleEventNames}
export default eventComponents
