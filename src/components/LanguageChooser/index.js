import React from 'react'
import SVGImage from '../SVGImage'
import './index.css'

const LanguageChooser = props => {
  const { languages, value, setValue } = props

  return (
    <div className='language-chooser__container'>
      {languages.map(language => (
        <div
          key={language}
          className={[
            'language-chooser__language-div-image',
            value === language &&
              'language-chooser__language-div-image--selected',
            value !== language &&
              'language-chooser__language-div-image--unselected',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <SVGImage
            clickable={value !== language}
            onClick={() => setValue(language)}
            name={language + '_flag'}
          />
        </div>
      ))}
    </div>
  )
}

export default LanguageChooser
