import React from 'react'
import Button from '../Button'
import {
  translateToMorse,
  translateFromMorse,
} from '../../helpers/translateMorse'
import './index.css'

export default () => {
  const [morseText, setMorseText] = React.useState('')
  const [conventionalMorseText, setConventionalMorseText] = React.useState('')
  const [text, setText] = React.useState('')
  const onMorseChange = event => {
    const newMorseText = event.target.value
    const textResult = translateFromMorse(newMorseText)
    setText(textResult)
    setConventionalMorseText(translateToMorse(textResult))
    if (morseText !== newMorseText) {
      setMorseText(newMorseText)
    }
  }
  const onMorseTextChange = event => {
    const newText = event.target.value.replace(/ +/g, ' ')
    const newMorseText = translateToMorse(newText)

    setText(newText)
    setMorseText(newMorseText)
    setConventionalMorseText(newMorseText)
  }
  const setMorseToConvention = () => {
    setMorseText(conventionalMorseText)
  }

  return (
    <div className='morse-translate__body'>
      <div className='morse-translate__format-button'>
        {conventionalMorseText !== morseText &&
          !conventionalMorseText.includes('#') && (
            <Button
              defaultStyles
              onClick={setMorseToConvention}
              text='Format morse'
            ></Button>
          )}
      </div>
      <div className='morse-translate__container'>
        <textarea
          autoFocus
          className='morse-translate__input-field'
          placeholder='Morse text to convert'
          value={morseText}
          onChange={onMorseChange}
        />
        <textarea
          className='morse-translate__input-field'
          value={text}
          placeholder='Text to convert to morse'
          onChange={onMorseTextChange}
        />
      </div>
    </div>
  )
}
