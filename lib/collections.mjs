export function arrayOf(length, value) {
  const valueFunction = value instanceof Function ? value : () => value
  return [...Array(length).fill().keys()].map(valueFunction)
}
