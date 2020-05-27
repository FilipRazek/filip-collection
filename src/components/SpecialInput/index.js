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
  } = props

  const getCaretLeft = React.useCallback(
    () => (caret ? caret - 1 : fixedLength - 1),
    [caret, fixedLength]
  )
  const getCaretRight = React.useCallback(() => (caret + 1) % fixedLength, [
    caret,
    fixedLength,
  ])
  const moveLeft = React.useCallback(() => setCaret(getCaretLeft()), [
    getCaretLeft,
    setCaret,
  ])
  const moveRight = React.useCallback(() => setCaret(getCaretRight()), [
    getCaretRight,
    setCaret,
  ])
  const deleteCharacter = React.useCallback(
    (position = caret) => setText(copyInsert(text, position, '_')),
    [caret, text, setText]
  )
  const backspace = React.useCallback(() => {
    if (fixedLength) {
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
      if (fixedLength) {
        const newText = copyInsert(text, caret, key)

        moveRight()
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

      if (fixedLength && caret === -1) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      }

      if (fixedLength) {
        if ([' ', '_', '.'].includes(e.key)) {
          clickKey('_')
        } else {
          const functionToCall = {
            Delete: deleteCharacter,
            ArrowRight: moveRight,
            ArrowLeft: moveLeft,
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
        {text.map((key, index) => (
          <p
            className={[
              'special-input__input-key',
              index === caret && 'special-input__input-key--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => props.onCellClick(index)}
            key={key + ', ' + index}
          >
            {fixedLength && !index ? key.toUpperCase() : key}
          </p>
        ))}
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
