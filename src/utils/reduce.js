// given an unsorted array of dates, reduce to the earliest
export function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}

// given an unsorted array of dates, reduce to the latest
export function latest (latest, value, i) {
  return value > latest ? value : latest
}
