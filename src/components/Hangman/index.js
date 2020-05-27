import React from 'react'
import Button from '../Button'
import FlashCard from '../FlashCard'
import Header from '../Header'
import SpecialInput from '../SpecialInput'
import { LOWERCASE_ALPHABET } from '../../constants/alphabet'
import { MAX_RESULTS, DEFAULT_LENGTH } from '../../constants/hangman'
import './index.css'

const getDefaultExcludedLetters = () =>
  LOWERCASE_ALPHABET.reduce((data, val) => ({ ...data, [val]: false }), {})

const getEmptyString = length => Array.from({ length }, () => '_')

export default () => {
  // TODO: Uniformize some and find
  // TODO: Add tests
  // TODO: Serve file with express to deploy app
  // TODO: Make excluded letters smaller
  // TODO: Add +/- buttons for length
  // TODO: Add option to select suggested letter (plat it)
  // TODO: Add two keyboard modes (edit selected & edit word)
  // TODO: Add suggested letter
  const [words, setWords] = React.useState([])
  const [excludedLetters, setExcludedLetters] = React.useState(
    getDefaultExcludedLetters()
  )
  const [errorInInput, setErrorInInput] = React.useState(false)
  const [length, setLength] = React.useState(DEFAULT_LENGTH)
  const [displayedLength, setDisplayedLength] = React.useState(
    DEFAULT_LENGTH.toString()
  )
  const [inputText, setInputText] = React.useState(
    getEmptyString(DEFAULT_LENGTH)
  )
  const [candidates, setCandidates] = React.useState([])
  const [caret, setCaret] = React.useState(0)

  const lengthInputRef = React.createRef()

  const hangmanMatches = (word, pattern) => {
    // Since this is a hangman match, characters appearing
    // in the input shall not be represented as blank characters (_)
    // For example, a _ _ _ should not match anna since the input would
    // then be a _ _ a
    const unMatchedCharacters = pattern.filter(letter => letter !== '_')
    if (pattern.length === 27) {
      return word.length > 26
    }
    if (pattern.length !== word.length) {
      return false
    }
    for (let i = 0; i < pattern.length; i++) {
      const charToMatch = pattern[i]
      if (
        !(
          (charToMatch === '_' && !unMatchedCharacters.includes(word[i])) ||
          charToMatch === word[i]
        )
      ) {
        return false
      }
    }
    return true
  }

  const findCandidates = React.useCallback(
    ({ text = inputText, excluded = excludedLetters } = {}) => {
      return words.filter(
        word =>
          hangmanMatches(word, text) &&
          !word.split('').find(letter => excluded[letter])
      )
    },
    [words, excludedLetters, inputText]
  )
  const updateInputText = input => {
    const newCandidates = findCandidates({ text: input })
    setErrorInInput(!!input.find(letter => excludedLetters[letter]))
    setCandidates(newCandidates)
    setInputText(input)
  }
  const toggleExcluded = letter => {
    const newExcludedLetters = {
      ...excludedLetters,
      [letter]: !excludedLetters[letter],
    }
    const newCandidates = findCandidates({ excluded: newExcludedLetters })
    setErrorInInput(!!inputText.find(letter => newExcludedLetters[letter]))
    setCandidates(newCandidates)
    setExcludedLetters(newExcludedLetters)
  }
  const reset = () => {
    setExcludedLetters(getDefaultExcludedLetters())
    setLength(DEFAULT_LENGTH)
    setDisplayedLength(DEFAULT_LENGTH.toString())
    const newInputText = getEmptyString(DEFAULT_LENGTH)
    setInputText(newInputText)
    setCandidates(findCandidates({ text: newInputText }))
    setCaret(0)
    lengthInputRef.current.focus()
  }
  const isReset = () =>
    !inputText.length &&
    LOWERCASE_ALPHABET.every(letter => !excludedLetters[letter])
  const handleLengthChange = event => {
    const input = event.target.value
    const candidateLength = ['26<', '>26'].includes(input)
      ? '27'
      : input
          .split('')
          .filter(letter => letter.match(/\d/))
          .join('')
    setDisplayedLength(candidateLength)
    if (candidateLength) {
      let positiveLength = Math.max(parseInt(candidateLength), 0)
      if (positiveLength > 26) {
        setDisplayedLength('>26')
      }
      const newLength = positiveLength > 26 ? 27 : positiveLength

      if (parseInt(newLength) !== length) {
        const newText = getEmptyString(newLength)
        const newCandidates = findCandidates({ text: newText })

        setLength(newLength)
        setInputText(newText)
        setCandidates(newCandidates)
      }
    }
  }

  React.useEffect(() => {
    const getWords = async () => {
      const data = await fetch('english_words.txt')
      const text = await data.text()
      const newWords = text.split('\r\n')
      console.log('Words', newWords.length)
      setWords(newWords)
    }
    getWords()
    setCandidates(findCandidates())
  }, [findCandidates])

  return (
    <div className='hangman__container'>
      <Header title='Hangman solver' helpPath='/help' />
      <div className='hangman__body'>
        <div className='hangman__input-div'>
          <div className='hangman__input-text-div'>
            <FlashCard
              medium
              isInput
              autoFocus
              ref={instance => (lengthInputRef.current = instance)}
              onFocus={() => setCaret(-1)}
              text={displayedLength}
              onChange={handleLengthChange}
            />
            <SpecialInput
              hideBackspace
              hideKeys
              onCellClick={index => setCaret(index)}
              fixedLength={length}
              caret={caret}
              setCaret={setCaret}
              text={inputText}
              setText={updateInputText}
              allowKeyInput
              availableLetters={LOWERCASE_ALPHABET}
            />
          </div>
          <Button
            text='Reset'
            secondaryStyles={isReset()}
            defaultStyles={!isReset()}
            onClick={reset}
          />
          <div className='hangman__letters'>
            {LOWERCASE_ALPHABET.map(letter => (
              <FlashCard
                small
                defaultColor={excludedLetters[letter] ? 'red' : 'green'}
                key={`Letter: ${letter}`}
                text={letter}
                onClick={() => toggleExcluded(letter)}
              />
            ))}
          </div>
        </div>
        <div className='hangman__output-div'>
          <h1>Results</h1>
          <p className='hangman__text'>
            {words.length
              ? candidates.length
                ? `${candidates.length} words found:`
                : 'No words found'
              : 'Loading words...'}
          </p>
          {!!candidates.length && (
            <ul>
              {candidates.slice(0, MAX_RESULTS).map(word => (
                <li key={word}>{word}</li>
              ))}
              {candidates.length > MAX_RESULTS && <li>...</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
