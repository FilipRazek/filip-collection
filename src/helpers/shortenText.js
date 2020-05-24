export default text => {
  const textList = text.split('')
  let j = 0
  for (let i = 0; i < textList.length; i += j) {
    j = 0
    while (i + j < textList.length && textList[i] === textList[i + j]) j++
    if (j >= 4) {
      textList.splice(i + 1, j - 2, '...')
      j = 3
    }
  }
  return textList.join('')
}
