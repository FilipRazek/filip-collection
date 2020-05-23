import React from 'react'
import Button from '../Button'
import MorseTestViewer from '../MorseTestViewer'
import SimpleSwitch from '../SimpleSwitch'
import SettingsDialog from '../SettingsDialog'
import { MORSE_TABLE } from '../../constants/morse'
import arrayRandom from '../../helpers/arrayRandom'
import './index.css'

export default props => {
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false)
  const [hardMode, setHardMode] = React.useState(false)
  const [quickTest, setQuickTest] = React.useState(false)
  const [onlyLearnedLetters, setOnlyLearnedLetters] = React.useState(false)
  const [poolReverse, setPoolReverse] = React.useState([])
  const [testPool, setTestPool] = React.useState([])

  const availableLetters = React.useCallback(
    Object.keys(MORSE_TABLE).filter(letter => ![' ', '*'].includes(letter))
  )
  const startTest = () => {
    const poolLength = quickTest ? 10 : availableLetters.length
    const pool = onlyLearnedLetters ? props.learnedLetters : availableLetters
    const chosenTestPool = arrayRandom(pool, { amount: poolLength })
    const chosenPoolReverse = Array.from(
      { length: poolLength },
      () => Math.random() > 0.5
    )

    setTestPool(chosenTestPool)
    setPoolReverse(chosenPoolReverse)
    props.setTestStarted(true)
    props.setGameDone(false)
    props.setGameCount(props.gameCount + 1)
  }
  const invalidOnlyLetters = () =>
    onlyLearnedLetters && props.learnedLetters.length < 10
  const invalidHardMode = () => hardMode && (quickTest || onlyLearnedLetters)

  return (
    <div className='morse-test__body'>
      <div className='morse-test__container'>
        {!props.testStarted && (
          <Button
            defaultStyles
            text='Begin test'
            onClick={() => setSettingsDialogOpen(true)}
          />
        )}
        {props.testStarted && (
          <MorseTestViewer
            hardMode={hardMode}
            pool={testPool}
            poolReverse={poolReverse}
            availableLetters={availableLetters}
            newGame={() => setSettingsDialogOpen(true)}
            gameCount={props.gameCount}
            setGameDone={props.setGameDone}
          />
        )}
        <SettingsDialog
          open={settingsDialogOpen}
          text='Test settings'
          confirmText='Let’s go'
          cancelText='Cancel'
          onCancel={() => setSettingsDialogOpen(false)}
          onClose={() => setSettingsDialogOpen(false)}
          onConfirm={() => {
            setSettingsDialogOpen(false)
            startTest()
          }}
          confirmDisabledMessage={
            invalidHardMode()
              ? 'Hard mode doesn’t allow you to choose other settings'
              : invalidOnlyLetters()
              ? `You haven’t learned enough letters (${props.learnedLetters.length}/10)`
              : ''
          }
          content={
            <div className='morse-test__settings'>
              <div className='morse-test__settings-element'>
                <p className='morse-test__settings-element-title'>Hard mode</p>
                <SimpleSwitch
                  value={hardMode}
                  toggle={() => setHardMode(!hardMode)}
                />
              </div>
              <div className='morse-test__settings-element'>
                <p className='morse-test__settings-element-title'>Quick test</p>
                <SimpleSwitch
                  value={quickTest}
                  isInvalid={invalidHardMode()}
                  toggle={() => setQuickTest(!quickTest)}
                />
              </div>
              <div className='morse-test__settings-element'>
                <p className='morse-test__settings-element-title'>
                  Test only learned letters
                </p>
                <SimpleSwitch
                  value={onlyLearnedLetters}
                  toggle={() => setOnlyLearnedLetters(!onlyLearnedLetters)}
                  isInvalid={invalidOnlyLetters() || invalidHardMode()}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
