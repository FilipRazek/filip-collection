import React from 'react'
import ReactTooltip from 'react-tooltip'
import Button from '../Button'
import FlashCard from '../FlashCard'
import Header from '../Header'
import LanguageChooser from '../LanguageChooser'
import SpecialInput from '../SpecialInput'
import getConstantArray from '../../helpers/getConstantArray'
import getLetterScore from '../../helpers/getLetterScore'
import { LOWERCASE_ALPHABET } from '../../constants/alphabet'
import {
  MAX_RESULTS,
  DEFAULT_LENGTH,
  MAX_INPUT_LENGTH,
  FIRST_MOVE,
  MAX_CANDIDATES_TO_AUTO_ANALYZE,
  LANGUAGES,
} from '../../constants/hangman'
import './index.css'

const getDefaultExcludedLetters = () =>
  LOWERCASE_ALPHABET.reduce((data, val) => ({ ...data, [val]: false }), {})

export default () => {
  const [words, setWords] = React.useState([])
  const [language, setLanguage] = React.useState(LANGUAGES[0])
  const [currentWords, setCurrentWords] = React.useState([])
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
    if (pattern.length === MAX_INPUT_LENGTH) {
      return word.length > MAX_INPUT_LENGTH - 1
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
    ({
      text = inputText,
      excluded = excludedLetters,
      selectedWords = currentWords,
    } = {}) => {
      return selectedWords.filter(
        word =>
          hangmanMatches(word, text) &&
          !word.split('').some(letter => excluded[letter])
      )
    },
    [excludedLetters, inputText, currentWords]
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
  const isReset = React.useCallback(
    (
      input = inputLetters,
      newExcludedLetters = excludedLetters,
      newLength = length
    ) =>
      input.join('') === getConstantArray(newLength, '_').join('') &&
      LOWERCASE_ALPHABET.every(letter => !newExcludedLetters[letter]),
    [excludedLetters, inputLetters, length]
  )
  const updateBestLetter = React.useCallback(
    (
      newCandidates,
      input,
      newGuessableInput,
      newExcludedLetters,
      newLength
    ) => {
      if (newLength === MAX_INPUT_LENGTH) {
        setBestLetter('[redacted]')
        return
      }
      if (isReset(input, newExcludedLetters, newLength)) {
        setBestLetter(FIRST_MOVE[language][newLength])
        return
      }
      const necessaryLetter = newGuessableInput.find(
        (letter, index) => input[index] === '_' && letter !== '_'
      )
      if (necessaryLetter) {
        setBestLetter(necessaryLetter)
      } else {
        const availableLetters = LOWERCASE_ALPHABET.filter(
          letter => !input.includes(letter)
        )
        const scores = availableLetters.map(getLetterScore(newCandidates))
        const bestScore = Math.min(...scores)
        setBestLetter(
          availableLetters.find((_, index) => scores[index] === bestScore)
        )
      }
    },
    [isReset, language]
  )
  const updateInputText = input => {
    const newCandidates = findCandidates({ text: input })
    const newWrongInput = input.map(letter => excludedLetters[letter])
    const newGuessableInput = getGuessableLetters(newCandidates)

    const firstWrong = newWrongInput.indexOf(true)
    if (firstWrong !== -1) {
      setCaret(firstWrong)
    }
    setWrongInput(newWrongInput)
    setCandidates(newCandidates)
    if (newCandidates !== candidates) {
      if (
        newCandidates.length > MAX_CANDIDATES_TO_AUTO_ANALYZE &&
        !isReset(input)
      ) {
        setBestLetter('')
      } else {
        updateBestLetter(
          newCandidates,
          input,
          newGuessableInput,
          excludedLetters,
          length
        )
      }
    }
    setGuessableInput(newGuessableInput)
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
    const newGuessableInput = getGuessableLetters(newCandidates)
    const firstWrong = newWrongInput.indexOf(true)
    if (firstWrong !== -1) {
      setCaret(firstWrong)
    }
    setWrongInput(newWrongInput)
    setCandidates(newCandidates)
    if (newCandidates !== candidates) {
      if (
        newCandidates.length > MAX_CANDIDATES_TO_AUTO_ANALYZE &&
        !isReset(inputText, newExcludedLetters)
      ) {
        setBestLetter('')
      } else {
        updateBestLetter(
          newCandidates,
          inputText,
          newGuessableInput,
          newExcludedLetters,
          length
        )
      }
    }
    setGuessableInput(newGuessableInput)
    setGuessableExcluded(getGuessableExcluded(newCandidates))
    setExcludedLetters(newExcludedLetters)
  }
  const reset = React.useCallback(
    (newLength = DEFAULT_LENGTH, newFocusOnInput = true) => {
      const newExcludedLetters = getDefaultExcludedLetters()
      const newInputText = getConstantArray(newLength, '_')
      const newCurrentWords = words.filter(word =>
        newLength === MAX_INPUT_LENGTH
          ? word.length > MAX_INPUT_LENGTH - 1
          : word.length === newLength
      )
      const newCandidates = findCandidates({
        text: newInputText,
        excluded: newExcludedLetters,
        selectedWords: newCurrentWords,
      })
      const newGuessableInput = getGuessableLetters(newCandidates, newLength)

      setCurrentWords(newCurrentWords)
      setExcludedLetters(newExcludedLetters)
      setLength(newLength)
      setDisplayedLength(
        newLength > MAX_INPUT_LENGTH - 1
          ? `>${MAX_INPUT_LENGTH - 1}`
          : newLength.toString()
      )
      setInputText(newInputText)
      setInputLetters([])
      setCandidates(newCandidates)
      updateBestLetter(
        newCandidates,
        newInputText,
        newGuessableInput,
        newExcludedLetters,
        newLength
      )
      setGuessableInput(newGuessableInput)
      setGuessableExcluded(getGuessableExcluded(newCandidates))
      setCaret(newFocusOnInput ? -1 : 0)
      setWrongInput(getConstantArray(length, false))
      setFocusOnInput(newFocusOnInput)
    },
    [
      words,
      length,
      getGuessableLetters,
      findCandidates,
      getGuessableExcluded,
      updateBestLetter,
    ]
  )
  const handleLengthChange = React.useCallback(
    (input, newFocusOnInput) => {
      const candidateLength = [
        `${MAX_INPUT_LENGTH - 1}<`,
        `>${MAX_INPUT_LENGTH - 1}`,
      ].includes(input)
        ? MAX_INPUT_LENGTH.toString()
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
      setDisplayedLength(
        strippedCandidate === (MAX_INPUT_LENGTH + 1).toString()
          ? `>${MAX_INPUT_LENGTH - 1}`
          : strippedCandidate
      )
      if (strippedCandidate) {
        const positiveLength = Math.max(parseInt(strippedCandidate), 0)
        const newLength =
          positiveLength > MAX_INPUT_LENGTH - 1
            ? MAX_INPUT_LENGTH
            : parseInt(positiveLength)

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
      const data = await fetch(`${language}_words.txt`)
      const text = await data.text()
      const newWords = text.split('\n').map(word => word.trim())
      setWords(newWords)
      setJustLoaded(true)
    }
    getWords()
  }, [language])
  React.useEffect(() => {
    if (justLoaded) {
      const newCurrentWords = words.filter(word =>
        length === MAX_INPUT_LENGTH
          ? word.length > MAX_INPUT_LENGTH - 1
          : word.length === length
      )
      setCurrentWords(newCurrentWords)
      const newCandidates = findCandidates({ selectedWords: newCurrentWords })
      const newGuessableInput = getGuessableLetters(newCandidates)
      setCandidates(newCandidates)
      updateBestLetter(
        newCandidates,
        inputText,
        newGuessableInput,
        excludedLetters,
        length
      )
      setGuessableInput(newGuessableInput)
      setGuessableExcluded(getGuessableExcluded(newCandidates))
      setJustLoaded(false)
    }
  }, [
    inputText,
    justLoaded,
    length,
    words,
    excludedLetters,
    updateBestLetter,
    getGuessableLetters,
    getGuessableExcluded,
    findCandidates,
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
                  secondaryStyles={['', `>${MAX_INPUT_LENGTH - 1}`].includes(
                    displayedLength
                  )}
                  defaultStyles={
                    !['', `>${MAX_INPUT_LENGTH - 1}`].includes(displayedLength)
                  }
                  onClick={() => handleLengthChangeUp(false)}
                />
              </div>
            </div>
            {displayedLength !== `>${MAX_INPUT_LENGTH - 1}` && (
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
            )}
          </div>
          <div className='hangman__commands'>
          <div className='hangman__language-chooser'>
            <LanguageChooser
              value={language}
              setValue={setLanguage}
              languages={LANGUAGES}
            />
            </div>
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
            {bestLetter && !getDisabledMessage() ? (
              <>
                <p className='hangman__output-best-letter-text'>
                  Best letter:{' '}
                  <span className='hangman__outpust-best-letter-letter'>
                    {length === 27 ? bestLetter : bestLetter.toUpperCase()}
                  </span>
                </p>
                {length !== MAX_INPUT_LENGTH && (
                  <Button
                    text='Not in word'
                    defaultRedStyles
                    onClick={() => toggleExcluded(bestLetter)}
                  />
                )}
              </>
            ) : (
              <>
                <Button
                  text='Get best letter'
                  data-for='get-best-letter-tooltip'
                  data-tip
                  disabled={getDisabledMessage()}
                  defaultStyles
                  onClick={() =>
                    updateBestLetter(
                      candidates,
                      inputText,
                      guessableInput,
                      excludedLetters,
                      length
                    )
                  }
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
                <li key={word}>
                  {word}
                  {length === MAX_INPUT_LENGTH && ` (${word.length})`}
                </li>
              ))}
              {candidates.length > MAX_RESULTS && <li>...</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
