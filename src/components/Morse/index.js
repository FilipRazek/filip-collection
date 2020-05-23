import React from 'react'
import Header from '../Header'
import MorseLearn from '../MorseLearn'
import MorseTest from '../MorseTest'
import MorseTranslate from '../MorseTranslate'
import ThreeWaySwitch from '../ThreeWaySwitch'
import YesNoDialog from '../YesNoDialog'
import { MORSE_TABLE } from '../../constants/morse'
import arrayRandom from '../../helpers/arrayRandom'
import './index.css'

const MODES = ['TRANSLATE', 'LEARN', 'TEST']

export default props => {
  const [testStarted, setTestStarted] = React.useState(false)
  const [gameDone, setGameDone] = React.useState(true)
  const [mode, setMode] = React.useState('TRANSLATE')
  const [testExcludedLetters, setTestExcludedLetters] = React.useState([
    ' ',
    '*',
  ])
  const [gameCount, setGameCount] = React.useState(0)
  const [testChosenLetter, setTestChosenLetter] = React.useState('')
  const [changeModeDialog, setChangeModeDialog] = React.useState('')

  const chooseRandomLetter = () => {
    const randomLetter = arrayRandom(Object.keys(MORSE_TABLE), {
      excluded: testExcludedLetters,
    })

    setTestExcludedLetters([...testExcludedLetters, randomLetter])
    setTestChosenLetter(randomLetter)
  }
  const changeMode = mode => {
    if (gameDone) {
      setTestStarted(false)
      setMode(mode)
    } else {
      setChangeModeDialog(mode)
    }
  }
  const component = {
    TRANSLATE: <MorseTranslate />,
    LEARN: (
      <MorseLearn
        excludedLetters={testExcludedLetters}
        chosenLetter={testChosenLetter}
        setMode={setMode}
        chooseRandomLetter={chooseRandomLetter}
      />
    ),
    TEST: (
      <MorseTest
        learnedLetters={testExcludedLetters.slice(2)}
        testStarted={testStarted}
        gameCount={gameCount}
        gameDone={gameDone}
        setGameDone={setGameDone}
        setGameCount={setGameCount}
        setTestStarted={setTestStarted}
      />
    ),
  }[mode]

  return (
    <div className='morse__container'>
      <Header title='Morse' helpPath='/help' />
      <ThreeWaySwitch
        value={MODES.indexOf(mode)}
        style={{
          '--color-start': 'var(--light-blue)',
          '--color-middle': 'var(--white)',
          '--color-end': 'var(--light-green)',
        }}
        onChange={event => {
          const value = event.target.value
          changeMode(MODES[value])
        }}
        onClick={index => changeMode(MODES[index])}
        list={['Translate', 'Learn', 'Test yourself']}
      />
      {component}
      <YesNoDialog
        open={!!changeModeDialog}
        onYes={() => {
          setChangeModeDialog('')
          setGameDone(true)
          setTestStarted(false)
          setMode(changeModeDialog)
        }}
        onClose={() => setChangeModeDialog('')}
        text='This test will be canceled if you switch modes. Do you want to continue?'
      />
    </div>
  )
}
