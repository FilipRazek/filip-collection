import React from 'react'
import Button from '../Button'
import FlashCard from '../FlashCard'
import SpecialInput from '../SpecialInput'
import arrayRandom from '../../helpers/arrayRandom'
import shuffle from '../../helpers/shuffle'
import { MORSE_TABLE } from '../../constants/morse'
import './index.css'

export default props => {
  // TODO: Add dialog on help/home button click (when testing)
  const [score, setScore] = React.useState(0)
  const [tries, setTries] = React.useState(0)
  const [ticks, setTicks] = React.useState(0)
  const [animatedAnswer, setAnimatedAnswer] = React.useState(false)
  const [animationColors, setAnimationColors] = React.useState({})
  const [answers, setAnswers] = React.useState([])
  const [animatedQuestionLetter, setAnimatedQuestionLetter] = React.useState(
    false
  )
  const [answer, setAnswer] = React.useState([])

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
    setTries(0)
    setTicks(0)
  }
  const getCurrentReverse = React.useCallback(() => poolReverse[tries], [
    poolReverse,
    tries,
  ])
  const getCurrentLetter = React.useCallback(
    () => (getCurrentReverse() ? MORSE_TABLE[pool[tries]] : pool[tries]),
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
  const testAnswer = React.useCallback(
    answer => {
      if (answer === getCurrentAnswer()) {
        setScore(score + 1)
      }
      setAnimatedAnswer(true)

      const newAnimationColors = {}
      newAnimationColors[answer] = 'red'
      newAnimationColors[getCurrentAnswer()] = 'green'

      setAnimationColors(newAnimationColors)
    },
    [getCurrentAnswer, score]
  )
  const hardModeNext = () => {
    setAnimatedQuestionLetter(true)
  }
  const getScoreText = () => {
    const remaining = pool.length - tries - 1 + (animatedAnswer ? 0 : 1)
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
      if (pool.length - tries - 1 + (animatedAnswer ? 0 : 1)) {
        setTicks(ticks + 1)
      }
    }, 100)
    return () => clearInterval(interval)
  }
  const handleKeyEvent = React.useCallback(
    e => {
      if (answers.includes(e.key)) {
        e.preventDefault()
        testAnswer(e.key)
      }
    },
    [answers, testAnswer]
  )
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
      {tries === pool.length && (
        <Button defaultStyles text='New game' onClick={newGame}></Button>
      )}
      {tries < pool.length && (
        <>
          <div className='morse-test-viewer__question-flash-card'>
            <FlashCard
              isSymbol={!getCurrentReverse()}
              medium
              unhoverable
              text={getCurrentLetter()}
              animationDuration='0.6s'
              onAnimationEnd={() => {
                if (tries === pool.length - 1) {
                  setGameDone(true)
                }
                setAnimatedQuestionLetter(false)
                setTries(tries + 1)
                setAnswer([])
              }}
              changeColor={animatedQuestionLetter}
              animateColor='light-green'
            />
          </div>
          {hardMode && (
            <div className='morse-test-viewer__hard-mode-answers'>
              <SpecialInput
                keys={!getCurrentReverse() && ['.', '-']}
                correctAnswer={getCurrentAnswer()}
                onDone={hardModeNext}
                availableLetters={availableLetters}
                animatedQuestionLetter={animatedQuestionLetter}
                text={answer}
                setText={setAnswer}
              />
            </div>
          )}
          {!hardMode && (
            <div className='morse-test-viewer__easy-mode-answers'>
              {answers.map(answer => (
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
                      if (tries === pool.length - 1) {
                        setGameDone(true)
                      }
                      setAnimatedAnswer(false)
                      setTries(tries + 1)
                      setAnswer([])
                    }
                  }}
                  onClick={animatedAnswer ? null : () => testAnswer(answer)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
