import { MORSE_TABLE } from '../constants/morse'

const translateLetterFromMorse = morseLetter => {
  const letter = Object.keys(MORSE_TABLE).find(
    key => MORSE_TABLE[key] === morseLetter
  )
  return letter ? letter : '#'
}

const replaceCH = text =>
  text
    .replace(/^-\.-\. \/ \.\.\.\.$/, '----')
    .replace(/ -\.-\. \/ \.\.\.\.$/, ' ----')
    .replace(/^-\.-\. \/ \.\.\.\. /, '---- ')
    .replace(/ -\.-\. \/ \.\.\.\. /g, ' ---- ')

export const translateToMorse = message =>
  replaceCH(
    message
      .trim()
      .toLowerCase()
      .split('')
      .map(letter =>
        Object.keys(MORSE_TABLE).some(key => key === letter)
          ? MORSE_TABLE[letter]
          : '#'
      )
      .join(' / ')
      .replace(/\/ {2}\//g, '//')
  )

export const translateFromMorse = message => {
  const standardMessage = message
    .replace(/ /g, '')
    .replace(/\|/g, '/')
    .replace(/_/g, '-')
    .replace(/\/{2,}/g, '//')
  if (standardMessage === '') {
    return ''
  }
  return standardMessage
    .split('/')
    .map(translateLetterFromMorse)
    .join('')
    .trim()
}
