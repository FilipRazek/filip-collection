export default (array, element, direction, length) => {
  const padding = Array.from({length: length - array.length}, () => element)
  if (direction === 'left'){
    return [...padding, ...array]
  }
  if (direction === 'left'){
    return [...array, ...padding]
  }
  return array
}
