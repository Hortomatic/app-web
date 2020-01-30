import GenericEvent from './Generic'
import PlantEvent from './Plant'
import TransplantEvent from './Transplant'
import {
	PLANT,
	TRANSPLANT,
	actionEventNames,
	lifecycleEventNames
} from 'constants/plantingEvents'

export const eventComponents = {
    [PLANT]: PlantEvent,
    [TRANSPLANT]: TransplantEvent
}
export {actionEventNames as actionEventNames}
export {lifecycleEventNames as lifecycleEventNames}

export default eventComponents