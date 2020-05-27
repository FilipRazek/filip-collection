import React from 'react'
import { romanToArabic, arabicToRoman } from '../../helpers/convertNumeral'
import shortenText from '../../helpers/shortenText'
import { LEGAL_LETTERS, MAX_ARABIC } from '../../constants/romanNumerals'
import Button from '../Button'
import Header from '../Header'
import './index.css'

export default () => {
  const [numeral, setNumeral] = React.useState('')
  const [conventionalNumeral, setConventionalNumeral] = React.useState('')
  const [illegalCharacters, setIllegalCharacters] = React.useState([])
  const [result, setResult] = React.useState(0)
  const [maxReached, setMaxReached] = React.useState(false)
  const onRomanChange = event => {
    const newNumeral = LEGAL_LETTERS.reduce(
      (acc, val) => acc.replace(new RegExp(val.toLowerCase(), 'g'), val),
      event.target.value.replace(/ /g, '')
    )
    const newIllegalCharacters = newNumeral
      .split('')
      .filter(letter => !LEGAL_LETTERS.includes(letter))

    if (!newIllegalCharacters.length) {
      const arabicResult = romanToArabic(newNumeral)
      setResult(arabicResult)
      setConventionalNumeral(arabicToRoman(arabicResult))
    } else {
      setResult('')
    }
    setIllegalCharacters(newIllegalCharacters)
    if (numeral !== newNumeral) {
      setNumeral(newNumeral)
    }
  }
  const onArabicChange = event => {
    const oneDigitIntegers = Array.from({ length: 10 }, (_, index) =>
      index.toString()
    )
    const candidateResult = event.target.value
      .split('')
      .filter(letter => oneDigitIntegers.includes(letter))
      .join('')
    const newResult = Math.min(candidateResult, MAX_ARABIC)
    const newNumeral = arabicToRoman(newResult)

    setResult(newResult)
    setConventionalNumeral(newNumeral)
    if (newNumeral !== numeral) {
      setNumeral(newNumeral)
    }
    setMaxReached(candidateResult > MAX_ARABIC)
    setIllegalCharacters([])
  }
  const setNumeralToConvention = () => {
    setNumeral(conventionalNumeral)
  }
  const getErrorText = () =>
    illegalCharacters.length
      ? `The provided numeral includes illegal characters, like "${illegalCharacters[0]}"`
      : conventionalNumeral && conventionalNumeral !== numeral
      ? `Did you mean "${shortenText(conventionalNumeral)}"?`
      : maxReached
      ? `You can't convert numbers greater than ${MAX_ARABIC}`
      : ''

  return (
    <div className='numeral-converter__body'>
      <Header title='Roman Numeral Converter' helpPath='/help' />
      <div className='numeral-converter__container'>
        <div className='numeral-converter__input-container'>
          <input
            autoFocus
            className='numeral-converter__input-field'
            placeholder='Roman numeral to convert'
            value={numeral}
            onChange={onRomanChange}
          />
          <input
            className={[
              'numeral-converter__input-field',
              'numeral-converter__input-field--small',
              illegalCharacters.length &&
                'numeral-converter__input-field--error',
            ]
              .filter(Boolean)
              .join(' ')}
            value={typeof result === 'number' && result ? result : ''}
            placeholder={
              illegalCharacters.length
                ? 'Please correct your input'
                : result
                ? result
                : 'Arabic numeral to convert'
            }
            onChange={onArabicChange}
          />
        </div>
        <div className='numeral-converter__output-container'>
          {getErrorText()}
          {!illegalCharacters.length &&
            conventionalNumeral &&
            conventionalNumeral !== numeral && (
              <Button
                defaultStyles
                onClick={setNumeralToConvention}
                text='Yes'
              ></Button>
            )}
        </div>
      </div>
    </div>
  )
}
