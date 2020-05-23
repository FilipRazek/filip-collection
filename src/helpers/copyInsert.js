export default (array, index, element) => [
  ...array.slice(0, index),
  element,
  ...array.slice(index + 1),
]
