import { LEGAL_LETTERS, LETTER_VALUE } from '../constants/romanNumerals'
import arrayPad from './arrayPad'

const greater_than = (a, b) =>
  LEGAL_LETTERS.indexOf(a) > LEGAL_LETTERS.indexOf(b)

const separate = (text, indices) =>
  indices.reduce(
    (acc, _, index) =>
      index === indices.length - 1
        ? acc
        : [...acc, text.slice(indices[index] + 1, indices[index + 1] + 1)],
    [text.slice(0, indices[0] + 1)]
  )

const cut = numeral => {
  const separatorIndices = []
  for (let i = 0; i < numeral.length - 1; i++) {
    if (greater_than(numeral[i], numeral[i + 1])) {
      separatorIndices.push(i)
    }
  }
  separatorIndices.push(numeral.length - 1)
  return separate(numeral, separatorIndices)
}

const value = block => {
  const separatedBlock = separateBlock(block)
  // Since we checked that the block is legal, separatedBlock has
  // at most two elements
  const blockToAdd = separatedBlock[separatedBlock.length - 1]
  const addValue = LETTER_VALUE[blockToAdd[0]] * blockToAdd.length
  const substractValue =
    separatedBlock.length > 1
      ? LETTER_VALUE[separatedBlock[0][0]] * separatedBlock[0].length
      : 0
  return addValue - substractValue
}

const allSymbolsEqual = block =>
  block.split('').reduce((current, val) => current && val === block[0], true)

const illegalBlock = block => {
  const separatedBlock = separateBlock(block)
  if (separatedBlock.length > 1) {
    if (
      !allSymbolsEqual(separatedBlock[1]) ||
      separatedBlock[0].length > 3 ||
      separatedBlock[1].length > 2
    ) {
      return true
    }
  }
  return false
}

const separateBlock = block => {
  const separatorIndices = []
  for (let i = 0; i < block.length - 1; i++) {
    if (block[i] !== block[i + 1]) {
      separatorIndices.push(i)
    }
  }
  if (separatorIndices.length) {
    const block1 = block.slice(0, separatorIndices[0] + 1)
    const block2 = block.slice(separatorIndices[0] + 1)
    return [block1, block2]
  }
  return [block]
}

const illegalOrder = symbols =>
  symbols.find(
    (_, index) =>
      index === symbols.length ||
      greater_than(symbols[index + 1], symbols[index])
  )

export const romanToArabic = numeral => {
  const blockForm = cut(numeral)
  const lastLettersInBlock = blockForm.map(block => block[block.length - 1])
  const valueBlocks = blockForm.map(value)
  const result = valueBlocks.reduce((acc, val) => acc + val, 0)

  if (
    illegalOrder(lastLettersInBlock) ||
    blockForm.some(illegalBlock) ||
    result === 0
  ) {
    return 'Unknown numeral'
  }

  return result
}

const getNumeralFromArabicDigit = (digit, index) => {
  // index indicates position in the decimal system:
  // 0 for hundreds, 1 for decades and 2 for units
  const [unit, quint, deca] = [
    ['C', 'D', 'M'],
    ['X', 'L', 'C'],
    ['I', 'V', 'X'],
  ][index]
  switch (digit) {
    case '4':
      return [unit, quint]
    case '9':
      return [unit, deca]
    case '0':
      return []
    default:
      const units = Array.from({ length: digit % 5 }, () => unit)
      return digit >= 5 ? [quint, ...units] : units
  }
}

export const arabicToRoman = numeral => {
  const stringNumeral = numeral.toString()
  const splitNumeral = arrayPad(
    stringNumeral.split('').slice(Math.max(stringNumeral.length - 3, 0)),
    '0',
    'left',
    3
  )
  const thousands = Array.from(
    { length: Math.floor(numeral / 1000) },
    () => 'M'
  )
  const underThousand = splitNumeral.reduce(
    (acc, digit, index) => [...acc, ...getNumeralFromArabicDigit(digit, index)],
    []
  )

  return [...thousands, ...underThousand].join('')
}
