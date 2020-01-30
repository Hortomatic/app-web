export function getPlant (plants, plantId) {
  if (!plants instanceof Map) {
    throw Error('Expected `plants` to be instance of Map')
  }
  return plants.get(plantId)
}
export function getPlantName (plant) {
  // TODO localize plant name
  return plant.name
}
