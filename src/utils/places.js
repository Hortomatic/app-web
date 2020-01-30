export function getPlace (places, placeId) {
  if (!places instanceof Map) {
    throw Error('Expected `places` to be instance of Map')
  }
  return places.get(placeId)
}
export function getPlaceName (place) {
  return place.name
}
