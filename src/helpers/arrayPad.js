import getConstantArray from './getConstantArray'

export default (array, element, direction, length) => {
  const padding = getConstantArray(length - array.length, element)
  if (direction === 'left') {
    return [...padding, ...array]
  }
  if (direction === 'left') {
    return [...array, ...padding]
  }
  return array
}
