import React from 'react'
import FlashCard from '../FlashCard'
import './index.css'

export default props => {
  const [text, setText] = React.useState([])
  const onDone = props.onDone

  const backspace = React.useCallback(() => {
    if (text.length > 0 && !props.animatedQuestionLetter) {
      const newText = [...text]
      newText.pop()
      setText(newText)
    }
  }, [text, props.animatedQuestionLetter])
  const clickKey = React.useCallback(
    key => {
      if (text.length < 7 && !props.animatedQuestionLetter) {
        const newText = [...text, key]
        setText(newText)
        if (newText.join('') === props.correctAnswer) {
          onDone()
        }
      }
    },
    [text, onDone, props.animatedQuestionLetter, props.correctAnswer]
  )
  const handleKeyEvent = React.useCallback(
    e => {
      const SUPPORTED_KEYS = props.keys ? props.keys : props.availableLetters

      if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      }
      if (SUPPORTED_KEYS.includes(e.key)) {
        e.preventDefault()
        clickKey(e.key)
      }
    },
    [clickKey, backspace, props.keys, props.availableLetters]
  )
  const handleListener = React.useCallback(() => {
    if (props.hardMode) {
      window.addEventListener('keydown', handleKeyEvent)
      return () => window.removeEventListener('keydown', handleKeyEvent)
    }
  }, [handleKeyEvent, props.hardMode])

  React.useEffect(
    React.useCallback(() => setText([]), []),
    [props.tries]
  )
  React.useEffect(handleListener)

  return (
    <div className='special-input__container'>
      <div className='special-input__input-keys-container'>
        {props.keys &&
          props.keys.map(key => (
            <FlashCard
              small
              key={key}
              text={key}
              clickable={text.length < 7 && !props.animatedQuestionLetter}
              onClick={() => clickKey(key)}
            />
          ))}
      </div>
      <div className='special-input__input-container'>
        {text.map((key, index) => (
          <p className='special-input__input-key' key={key + ', ' + index}>
            {key}
          </p>
        ))}
      </div>
      <div className='special-input__input-keys-container'>
        <FlashCard
          clickable={text.length > 0 && !props.animatedQuestionLetter}
          onClick={backspace}
          small
          text='Backspace'
        />
      </div>
    </div>
  )
}
