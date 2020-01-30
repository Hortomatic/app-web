export default function modelArrayToMap (array) {
  return new Map(array.map(
    item => [item.id, item]
  ))
}
