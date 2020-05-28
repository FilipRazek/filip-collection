import React from 'react'
import FlashCard from '../FlashCard'
import copyInsert from '../../helpers/copyInsert'
import './index.css'

export default props => {
  const {
    text,
    setText,
    onDone,
    animatedQuestionLetter,
    keys,
    correctAnswer,
    availableLetters,
    fixedLength,
    caret,
    setCaret,
    hideKeys,
    hideBackspace,
    wrongInput,
    otherInput,
  } = props

  const getCaretLeft = React.useCallback(
    (onlyEmpty = false) => {
      let i = 1
      while (
        onlyEmpty &&
        text[caret >= i ? caret - i : fixedLength + caret - i] !== '_' &&
        i !== fixedLength
      ) {
        i++
      }
      return caret >= i ? caret - i : fixedLength + caret - i
    },
    [caret, fixedLength, text]
  )
  const getCaretRight = React.useCallback(
    (onlyEmpty = false) => {
      let i = 1
      while (
        onlyEmpty &&
        text[(caret + i) % fixedLength] !== '_' &&
        i !== fixedLength
      ) {
        i++
      }
      return (caret + i) % fixedLength
    },
    [caret, fixedLength, text]
  )
  const moveLeft = React.useCallback(
    (onlyEmpty = false) => setCaret(getCaretLeft(onlyEmpty)),
    [getCaretLeft, setCaret]
  )
  const moveRight = React.useCallback(
    (onlyEmpty = false) => setCaret(getCaretRight(onlyEmpty)),
    [getCaretRight, setCaret]
  )
  const deleteCharacter = React.useCallback(
    (position = caret) => setText(copyInsert(text, position, '_')),
    [caret, text, setText]
  )
  const backspace = React.useCallback(() => {
    if (fixedLength !== undefined) {
      moveLeft()
      deleteCharacter(getCaretLeft())
    } else {
      if (text.length > 0 && !animatedQuestionLetter) {
        const newText = [...text]
        newText.pop()
        setText(newText)
      }
    }
  }, [
    text,
    animatedQuestionLetter,
    setText,
    deleteCharacter,
    moveLeft,
    getCaretLeft,
    fixedLength,
  ])
  const clickKey = React.useCallback(
    key => {
      if (fixedLength !== undefined) {
        const newText = copyInsert(text, caret, key)

        moveRight(true)
        setText(newText)
      } else {
        if (text.length < 7 && !animatedQuestionLetter) {
          const newText = [...text, key]
          setText(newText)

          if (newText.join('') === correctAnswer) {
            onDone()
          }
        }
      }
    },
    [
      text,
      onDone,
      animatedQuestionLetter,
      correctAnswer,
      setText,
      fixedLength,
      caret,
      moveRight,
    ]
  )
  const handleKeyEvent = React.useCallback(
    e => {
      const SUPPORTED_KEYS = keys ? keys : availableLetters

      if (fixedLength !== undefined && caret === -1) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      }

      if (fixedLength !== undefined) {
        if ([' ', '_', '.'].includes(e.key)) {
          clickKey('_')
        } else {
          const functionToCall = {
            Delete: deleteCharacter,
            ArrowRight: moveRight,
            ArrowLeft: moveLeft,
            ArrowUp: () => moveLeft(true),
            ArrowDown: () => moveRight(true),
          }[e.key]
          if (functionToCall) {
            e.preventDefault()
            functionToCall()
          }
        }
      }
      const key = e.key.toLowerCase()
      if (SUPPORTED_KEYS.includes(key)) {
        clickKey(key)
      }
    },
    [
      availableLetters,
      backspace,
      clickKey,
      deleteCharacter,
      fixedLength,
      keys,
      caret,
      moveLeft,
      moveRight,
    ]
  )
  const handleListener = React.useCallback(() => {
    window.addEventListener('keydown', handleKeyEvent)
    return () => window.removeEventListener('keydown', handleKeyEvent)
  }, [handleKeyEvent])

  React.useEffect(handleListener)

  return (
    <div className='special-input__container'>
      {!hideKeys && (
        <div className='special-input__input-keys-container'>
          {keys &&
            keys.map(key => (
              <FlashCard
                small
                key={key}
                text={key}
                clickable={text.length < 7 && !animatedQuestionLetter}
                onClick={() => clickKey(key)}
              />
            ))}
        </div>
      )}
      <div className='special-input__input-container'>
        {text.map((key, index) => {
          const text =
            key === '_' && otherInput[index] !== '_'
              ? `(${otherInput[index]})`
              : key
          return (
            <p
              className={[
                'special-input__input-key',
                key === '_' &&
                  otherInput[index] !== '_' &&
                  'special-input__input-key--hint',
                key === '_' &&
                  otherInput[index] !== '_' &&
                  index === caret &&
                  'special-input__input-key--selected-and-hint',
                index === caret && 'special-input__input-key--selected',
                wrongInput[index] && 'special-input__input-key--wrong',
                wrongInput[index] &&
                  index === caret &&
                  'special-input__input-key--selected-and-wrong',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => props.onCellClick(index)}
              key={key + ', ' + index}
            >
              {fixedLength !== undefined && !index ? text.toUpperCase() : text}
            </p>
          )
        })}
      </div>
      {!hideBackspace && (
        <div className='special-input__input-keys-container'>
          <FlashCard
            clickable={text.length > 0 && !animatedQuestionLetter}
            onClick={backspace}
            small
            text='Backspace'
          />
        </div>
      )}
    </div>
  )
}
