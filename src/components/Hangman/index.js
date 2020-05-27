import React from 'react'
import ReactTooltip from 'react-tooltip'
import Button from '../Button'
import FlashCard from '../FlashCard'
import Header from '../Header'
import SpecialInput from '../SpecialInput'
import getConstantArray from '../../helpers/getConstantArray'
import getLetterScore from '../../helpers/getLetterScore'
import { LOWERCASE_ALPHABET } from '../../constants/alphabet'
import { MAX_RESULTS, DEFAULT_LENGTH } from '../../constants/hangman'
import './index.css'

const getDefaultExcludedLetters = () =>
  LOWERCASE_ALPHABET.reduce((data, val) => ({ ...data, [val]: false }), {})

export default () => {
  // TODO: Add option to select suggested letter (plan it)
  // TODO: Add two (three?) keyboard modes (edit selected & edit word)
  // TODO: Add dialog to reset word
  // TODO: Add check to see if hangman is solved (constant MAX_NUMBER_OF_MOVES)
  // TODO: Add caret jump on double letter input
  // TODO: Special input cursor pointer (?)
  // TODO: Store first two moves in memory
  // TODO: Add in-between move to gather more information
  // TODO: Add option to distinguish I from l
  // TODO: Move solver to helper
  // TODO: Add language change
  const [words, setWords] = React.useState([])
  const [justLoaded, setJustLoaded] = React.useState(false)
  const [excludedLetters, setExcludedLetters] = React.useState(
    getDefaultExcludedLetters()
  )
  const [wrongInput, setWrongInput] = React.useState(
    getConstantArray(DEFAULT_LENGTH, false)
  )
  const [length, setLength] = React.useState(DEFAULT_LENGTH)
  const [displayedLength, setDisplayedLength] = React.useState(
    DEFAULT_LENGTH.toString()
  )
  const [inputText, setInputText] = React.useState(
    getConstantArray(DEFAULT_LENGTH, '_')
  )
  const [candidates, setCandidates] = React.useState([])
  const [caret, setCaret] = React.useState(0)
  const [inputLetters, setInputLetters] = React.useState([])
  const [focusOnInput, setFocusOnInput] = React.useState(true)
  const [guessableInput, setGuessableInput] = React.useState(
    getConstantArray(DEFAULT_LENGTH, '_')
  )
  const [guessableExcluded, setGuessableExcluded] = React.useState(
    getConstantArray(LOWERCASE_ALPHABET.length, false)
  )
  const [bestLetter, setBestLetter] = React.useState()

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
          !word.split('').some(letter => excluded[letter])
      )
    },
    [words, excludedLetters, inputText]
  )
  const getGuessableLetters = React.useCallback(
    (candidateWords, inputLength = length) =>
      Array.from({ length: inputLength }, (_, index) => {
        const candidateLetter = candidateWords.length
          ? candidateWords[0][index]
          : '_'
        return candidateWords.every(
          candidate => candidate[index] === candidateLetter
        )
          ? candidateLetter
          : '_'
      }),
    [length]
  )
  const getGuessableExcluded = React.useCallback(
    candidateWords =>
      LOWERCASE_ALPHABET.map(letter => {
        let letterInCandidates = false
        candidateWords.forEach(candidate => {
          if (
            !letterInCandidates &&
            candidate
              .split('')
              .find(candidateLetter => letter === candidateLetter)
          ) {
            letterInCandidates = true
          }
        })
        return !letterInCandidates
      }),
    []
  )
  const updateBestLetter = React.useCallback(
    newCandidates => {
      const availableLetters = LOWERCASE_ALPHABET.filter(
        letter => !inputText.includes(letter)
      )
      const scores = availableLetters.map(getLetterScore(newCandidates))
      const bestScore = Math.min(...scores)
      setBestLetter(
        availableLetters.find((_, index) => scores[index] === bestScore)
      )
    },
    [inputText]
  )
  const updateInputText = input => {
    const newCandidates = findCandidates({ text: input })
    const newWrongInput = input.map(letter => excludedLetters[letter])
    const firstWrong = newWrongInput.indexOf(true)
    if (firstWrong !== -1) {
      setCaret(firstWrong)
    }
    setWrongInput(newWrongInput)
    setCandidates(newCandidates)
    if (newCandidates !== candidates) {
      setBestLetter('')
    }
    setGuessableInput(getGuessableLetters(newCandidates))
    setGuessableExcluded(getGuessableExcluded(newCandidates))
    setInputText(input)
    setInputLetters(input.filter(letter => letter !== '_'))
  }
  const toggleExcluded = letter => {
    const newExcludedLetters = {
      ...excludedLetters,
      [letter]: !excludedLetters[letter],
    }
    const newCandidates = findCandidates({ excluded: newExcludedLetters })
    const newWrongInput = inputText.map(letter => newExcludedLetters[letter])
    const firstWrong = newWrongInput.indexOf(true)
    if (firstWrong !== -1) {
      setCaret(firstWrong)
    }
    setWrongInput(newWrongInput)
    setCandidates(newCandidates)
    if (newCandidates !== candidates) {
      setBestLetter('')
    }
    setGuessableInput(getGuessableLetters(newCandidates))
    setGuessableExcluded(getGuessableExcluded(newCandidates))
    setExcludedLetters(newExcludedLetters)
  }
  const reset = React.useCallback(
    (newLength = DEFAULT_LENGTH, newFocusOnInput = true) => {
      const newExcludedLetters = getDefaultExcludedLetters()
      const newInputText = getConstantArray(newLength, '_')
      const newCandidates = findCandidates({
        text: newInputText,
        excluded: newExcludedLetters,
      })

      setExcludedLetters(newExcludedLetters)
      setLength(newLength)
      setDisplayedLength(newLength > 26 ? '>26' : newLength.toString())
      setInputText(newInputText)
      setInputLetters([])
      setCandidates(newCandidates)
      if (newCandidates !== candidates) {
        setBestLetter('')
      }
      setGuessableInput(getGuessableLetters(newCandidates, newLength))
      setGuessableExcluded(getGuessableExcluded(newCandidates))
      setCaret(newFocusOnInput ? -1 : 0)
      setWrongInput(getConstantArray(length, false))
      setFocusOnInput(newFocusOnInput)
    },
    [
      findCandidates,
      length,
      getGuessableLetters,
      candidates,
      getGuessableExcluded,
    ]
  )
  const isReset = () =>
    inputText.join('') === getConstantArray(length, '_').join('') &&
    LOWERCASE_ALPHABET.every(letter => !excludedLetters[letter])
  const handleLengthChange = React.useCallback(
    (input, newFocusOnInput) => {
      const candidateLength = ['26<', '>26'].includes(input)
        ? '27'
        : input
            .split('')
            .filter(letter => letter.match(/\d/))
            .join('')
      let index = 0
      while (
        index < candidateLength.length - 1 &&
        candidateLength[index] === '0'
      ) {
        index++
      }
      const strippedCandidate = candidateLength
        ? candidateLength.slice(index, candidateLength.length)
        : candidateLength
      setDisplayedLength(strippedCandidate)
      if (strippedCandidate) {
        const positiveLength = Math.max(parseInt(strippedCandidate), 0)
        const newLength = positiveLength > 26 ? 27 : parseInt(positiveLength)

        if (newLength !== length) {
          reset(newLength, newFocusOnInput)
        }
      }
    },
    [length, reset]
  )
  const handleLengthChangeDown = React.useCallback(
    (focusOnInput = true) => {
      if (displayedLength && length) {
        const newLength = length - 1
        handleLengthChange(newLength.toString(), focusOnInput)
      }
    },
    [displayedLength, handleLengthChange, length]
  )

  const handleLengthChangeUp = React.useCallback(
    (focusOnInput = true) => {
      const newLength = displayedLength ? length + 1 : 1
      handleLengthChange(newLength.toString(), focusOnInput)
    },
    [displayedLength, handleLengthChange, length],
    true
  )

  const handleKeyEvent = React.useCallback(
    e => {
      if (caret === -1) {
        if (e.key === 'ArrowUp') {
          handleLengthChangeUp()
        } else if (e.key === 'ArrowDown') {
          handleLengthChangeDown()
        }
      }
    },
    [caret, handleLengthChangeUp, handleLengthChangeDown]
  )
  const handleListener = React.useCallback(() => {
    window.addEventListener('keydown', handleKeyEvent)
    return () => window.removeEventListener('keydown', handleKeyEvent)
  }, [handleKeyEvent])
  const getDisabledMessage = () => {
    if (!words.length) return 'Dictionary is loading...'
    if (!candidates.length) return 'No words found'
    const realInputLength = inputText.filter(letter => letter !== '_').length
    if (realInputLength === length) return 'You can not play from here'

    return ''
  }

  React.useEffect(handleListener)
  React.useEffect(() => {
    const getWords = async () => {
      const data = await fetch('english_words.txt')
      const text = await data.text()
      const newWords = text.split('\n').map(word => word.trim())
      setWords(newWords)
      setJustLoaded(true)
    }
    getWords()
  }, [])
  React.useEffect(() => {
    if (justLoaded) {
      const newCandidates = findCandidates()
      setCandidates(newCandidates)
      if (newCandidates !== candidates) {
        setBestLetter('')
      }
      setGuessableInput(getGuessableLetters(newCandidates))
      setGuessableExcluded(getGuessableExcluded(newCandidates))
      setJustLoaded(false)
    }
  }, [
    justLoaded,
    words,
    findCandidates,
    getGuessableLetters,
    candidates,
    getGuessableExcluded,
  ])
  React.useEffect(() => {
    if (focusOnInput) {
      lengthInputRef.current.focus()
    } else {
      lengthInputRef.current.blur()
    }
  }, [lengthInputRef, focusOnInput])

  return (
    <div className='hangman__container'>
      <Header title='Hangman solver' helpPath='/help' />
      <div className='hangman__body'>
        <div className='hangman__input-div'>
          <div className='hangman__input-text-div'>
            <div className='hangman__input-text-length-div'>
              <FlashCard
                ref={lengthInputRef}
                medium
                isInput
                onFocus={() => {
                  setFocusOnInput(true)
                  setCaret(-1)
                }}
                text={displayedLength}
                onChange={event => handleLengthChange(event.target.value)}
              />
              <div className='hangman__input-text-length-buttons-div'>
                <Button
                  text='-'
                  secondaryStyles={['', '0'].includes(displayedLength)}
                  defaultStyles={!['', '0'].includes(displayedLength)}
                  onClick={() => handleLengthChangeDown(false)}
                />
                <Button
                  text='+'
                  secondaryStyles={['', '>26'].includes(displayedLength)}
                  defaultStyles={!['', '>26'].includes(displayedLength)}
                  onClick={() => handleLengthChangeUp(false)}
                />
              </div>
            </div>
            <SpecialInput
              hideBackspace
              hideKeys
              otherInput={guessableInput}
              wrongInput={wrongInput}
              onCellClick={index => {
                setFocusOnInput(false)
                setCaret(index)
              }}
              fixedLength={length}
              caret={caret}
              setCaret={setCaret}
              text={inputText}
              setText={updateInputText}
              allowKeyInput
              availableLetters={LOWERCASE_ALPHABET}
            />
          </div>
          <div className='hangman__reset-buttons'>
            <Button
              text='Reset word'
              secondaryStyles={isReset()}
              defaultStyles={!isReset()}
              onClick={() => reset(length, isReset())}
            />
            <Button
              text='Reset excluded letters'
              secondaryStyles={LOWERCASE_ALPHABET.every(
                letter => !excludedLetters[letter]
              )}
              defaultStyles={LOWERCASE_ALPHABET.some(
                letter => excludedLetters[letter]
              )}
              onClick={() => {
                const newExcludedLetters = getDefaultExcludedLetters()
                setGuessableExcluded(
                  getConstantArray(LOWERCASE_ALPHABET.length, false)
                )
                setExcludedLetters(newExcludedLetters)
                setCandidates(findCandidates({ excluded: newExcludedLetters }))
              }}
            />
            <Button
              text='Reset'
              secondaryStyles={isReset() && length === DEFAULT_LENGTH}
              defaultStyles={!isReset() || length !== DEFAULT_LENGTH}
              onClick={() => reset()}
            />
          </div>
          <h3 className='hangman__letters-info'>
            Click to toggle excluded letters:
          </h3>
          <div className='hangman__letters'>
            {LOWERCASE_ALPHABET.map((letter, index) => (
              <FlashCard
                small
                defaultColor={
                  excludedLetters[letter]
                    ? 'red'
                    : inputLetters.includes(letter)
                    ? 'light-blue'
                    : guessableExcluded[index]
                    ? 'light-orange'
                    : 'green'
                }
                key={`Letter: ${letter}`}
                text={letter}
                onClick={() => toggleExcluded(letter)}
              />
            ))}
          </div>
        </div>
        <div className='hangman__output-div'>
          <h1>Results</h1>
          <div className='hangman__output-best-letter'>
            {bestLetter ? (
              <p className='hangman__output-best-letter-text'>
                Best letter: {bestLetter.toUpperCase()}
              </p>
            ) : (
              <>
                <Button
                  text='Get best letter'
                  data-for='get-best-letter-tooltip'
                  data-tip
                  disabled={getDisabledMessage()}
                  defaultStyles
                  onClick={() => updateBestLetter(candidates)}
                />
                {getDisabledMessage() && (
                  <ReactTooltip id='get-best-letter-tooltip' effect='solid'>
                    {getDisabledMessage()}
                  </ReactTooltip>
                )}
              </>
            )}
          </div>
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
