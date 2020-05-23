const choice = array => array[Math.floor(Math.random() * array.length)]

export default (array, { amount = 1, excluded = [] } = {}) => {
  const excludedElements = [...excluded]
  const randomArray = Array.from({ length: amount }, () => {
    const chosenItem = choice(array.filter(item => !excludedElements.includes(item)))
    excludedElements.push(chosenItem)
    return chosenItem
  })

  if (amount === 1){
    return randomArray[0]
  }
  return randomArray
}
