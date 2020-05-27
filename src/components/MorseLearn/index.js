import React from 'react'
import Button from '../Button'
import FlashCard from '../FlashCard'
import { MORSE_TABLE } from '../../constants/morse'
import './index.css'

export default props => {
  const { setMode, chooseRandomLetter, chosenLetter, excludedLetters } = props
  const nextLetter = React.useCallback(() => {
    chosenLetter ? chooseRandomLetter() : setMode('TEST')
  }, [chosenLetter, chooseRandomLetter, setMode])
  const handleKeyEvent = React.useCallback(
    e => {
      if (['Enter', ' '].includes(e.key) && chosenLetter) {
        e.preventDefault()
        nextLetter()
      }
    },
    [nextLetter, chosenLetter]
  )
  const handleListener = React.useCallback(() => {
    window.addEventListener('keydown', handleKeyEvent)
    return () => window.removeEventListener('keydown', handleKeyEvent)
  }, [handleKeyEvent])
  const remainingLetters = React.useCallback(
    Object.keys(MORSE_TABLE).length - excludedLetters.length + 1
  )

  React.useEffect(handleListener)
  React.useEffect(
    React.useCallback(() => {
      if (excludedLetters.length === 2) chooseRandomLetter()
    }, [chooseRandomLetter, excludedLetters]),
    [excludedLetters, chooseRandomLetter]
  )

  return (
    <div className='morse-learn__body'>
      <div className='morse-learn__container'>
        <div className='morse-learn__flash-cards'>
          {chosenLetter && <FlashCard isSymbol text={chosenLetter} />}
          {!chosenLetter && (
            <p className='morse-learn__flash-cards-info'>
              You have learned everything there was to learn. Test yourself now!
            </p>
          )}
          <div className='morse-learn__next-button'>
            <Button
              defaultStyles
              text={
                chosenLetter ? `Next symbol (${remainingLetters} left)` : 'Test'
              }
              onClick={nextLetter}
            />
          </div>
          {chosenLetter && <FlashCard text={MORSE_TABLE[chosenLetter]} />}
        </div>
      </div>
    </div>
  )
}
