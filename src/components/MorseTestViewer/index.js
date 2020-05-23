import React from 'react'
import Button from '../Button'
import FlashCard from '../FlashCard'
import SpecialInput from '../SpecialInput'
import arrayRandom from '../../helpers/arrayRandom'
import shuffle from '../../helpers/shuffle'
import { MORSE_TABLE } from '../../constants/morse'
import './index.css'

export default props => {
  const [score, setScore] = React.useState(0)
  const [tries, setTries] = React.useState(1)
  const [ticks, setTicks] = React.useState(0)
  const [animatedAnswer, setAnimatedAnswer] = React.useState(false)
  const [animationColors, setAnimationColors] = React.useState({})
  const [answers, setAnswers] = React.useState([])
  const [animatedQuestionLetter, setAnimatedQuestionLetter] = React.useState(
    false
  )

  const {
    poolReverse,
    pool,
    availableLetters,
    hardMode,
    gameCount,
    setGameDone,
    newGame,
  } = props

  const reset = () => {
    setScore(0)
    setTries(1)
    setTicks(0)
  }
  const getCurrentReverse = React.useCallback(() => poolReverse[tries - 1], [
    poolReverse,
    tries,
  ])
  const getCurrentLetter = React.useCallback(
    () =>
      getCurrentReverse() ? MORSE_TABLE[pool[tries - 1]] : pool[tries - 1],
    [pool, getCurrentReverse, tries]
  )
  const getCurrentAnswer = React.useCallback(
    () =>
      getCurrentReverse()
        ? Object.keys(MORSE_TABLE).find(
            key => MORSE_TABLE[key] === getCurrentLetter()
          )
        : MORSE_TABLE[getCurrentLetter()],
    [getCurrentLetter, getCurrentReverse]
  )
  const updateAnswers = () => {
    const correctAnswer = getCurrentAnswer()
    const answerPool = getCurrentReverse()
      ? availableLetters
      : availableLetters.map(letter => MORSE_TABLE[letter])
    const otherAnswers = arrayRandom(answerPool, {
      amount: 2,
      excluded: [correctAnswer],
    })
    const answers = shuffle([...otherAnswers, correctAnswer])
    setAnswers(answers)
  }
  const testAnswer = React.useCallback(answer => {
    if (answer === getCurrentAnswer()) {
      setScore(score + 1)
    }
    setAnimatedAnswer(true)

    const newAnimationColors = {}
    newAnimationColors[answer] = 'error'
    newAnimationColors[getCurrentAnswer()] = 'green'

    setAnimationColors(newAnimationColors)
  }, [getCurrentAnswer, score])
  const hardModeNext = () => {
    setAnimatedQuestionLetter(true)
  }
  const getScoreText = () => {
    const remaining = pool.length - tries + (animatedAnswer ? 0 : 1)
    if (hardMode) {
      return (
        <>
          <p className='morse-test-viewer__score-text'>
            {remaining ? 'Time elapsed' : 'Done in'}: {(ticks / 10).toFixed(1)}
            {' s'}
          </p>
          <p className='morse-test-viewer__score-text'>
            {remaining ? ` ${remaining} remaining` : ''}
          </p>
        </>
      )
    }
    return (
      <p>
        Score: {score}/{pool.length}
        {remaining ? ` (${remaining} remaining)` : ''}
      </p>
    )
  }
  const setTimer = () => {
    const interval = setInterval(() => {
      if (pool.length - tries + (animatedAnswer ? 0 : 1)) {
        setTicks(ticks + 1)
      }
    }, 100)
    return () => clearInterval(interval)
  }
  const handleKeyEvent = React.useCallback(e => {
    if (answers.includes(e.key)) {
      e.preventDefault()
      testAnswer(e.key)
    }
  }, [answers, testAnswer])
  const handleListener = React.useCallback(() => {
    if (!hardMode) {
      window.addEventListener('keydown', handleKeyEvent)
      return () => window.removeEventListener('keydown', handleKeyEvent)
    }
  }, [handleKeyEvent, hardMode])

  React.useEffect(handleListener)
  React.useEffect(updateAnswers, [tries])
  React.useEffect(reset, [gameCount])
  React.useEffect(setTimer)

  return (
    <div className='morse-test-viewer__body'>
      {getScoreText()}
      {tries - 1 === pool.length && (
        <Button defaultStyles text='New game' onClick={newGame}></Button>
      )}
      {tries - 1 < pool.length && (
        <>
          <FlashCard
            isSymbol={!getCurrentReverse()}
            medium
            unhoverable
            text={getCurrentLetter()}
            animationDuration='0.6s'
            onAnimationEnd={() => {
              if (tries === pool.length) {
                setGameDone(true)
              }
              setAnimatedQuestionLetter(false)
              setTries(tries + 1)
            }}
            changeColor={animatedQuestionLetter}
            animateColor='light-green'
          />
          <div className='morse-test-viewer__answers'>
            {hardMode && (
              <SpecialInput
                keys={!getCurrentReverse() && ['.', '-']}
                correctAnswer={getCurrentAnswer()}
                onDone={hardModeNext}
                tries={tries}
                hardMode={hardMode}
                availableLetters={availableLetters}
                animatedQuestionLetter={animatedQuestionLetter}
              />
            )}
            {!hardMode &&
              answers.map(answer => (
                <FlashCard
                  key={answer}
                  small
                  animationDuration={
                    Object.keys(animationColors).length - 0.5 + 's'
                  }
                  changeColor={animationColors[answer] && animatedAnswer}
                  clickable={!animatedAnswer}
                  text={answer}
                  animateColor={animationColors[answer]}
                  onAnimationEnd={() => {
                    if (answer === getCurrentAnswer()) {
                      if (tries === pool.length) {
                        setGameDone(true)
                      }
                      setAnimatedAnswer(false)
                      setTries(tries + 1)
                    }
                  }}
                  onClick={animatedAnswer ? null : () => testAnswer(answer)}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}
