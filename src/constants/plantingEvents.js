export const PLANT = 'plant'
export const TRANSPLANT = 'transplant'
export const HARVEST = 'harvest'
export const PLANTOUT = 'plantOut'
export const POTON = 'potOn'
export const FERTILIZE = 'fertilize'

export const GERMINATE = 'germinate'
export const LEAF = 'leaf'
export const FLOWER = 'flower'
export const FRUIT = 'fruit'
export const DEATH = 'death'
export const DIEBACK = 'dieBack'

export const actionEventNames = [
    PLANT,
    TRANSPLANT,
    HARVEST,
    PLANTOUT,
    POTON,
    FERTILIZE
]

export const lifecycleEventNames = [
    GERMINATE,
    LEAF,
    FLOWER,
    FRUIT,
    DEATH,
    DIEBACK
]

export default [].concat(actionEventNames, lifecycleEventNames)
