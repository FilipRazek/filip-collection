export default text => {
  const textList = text.split('')
  for (let i = 0; i < textList.length; i++) {
    let j = 0
    while (i + j < textList.length && text[i] === text[i + j]) {
      j++
    }
    if (j >= 5) {
      textList.splice(i + 1, j - 4, '...')
    }
    i++
    i++
  }
  return textList.join('')
}
