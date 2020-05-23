import React from 'react'
import SVGImage from '../SVGImage'
import SimpleSwitch from '../SimpleSwitch'
import './index.css'

export default props => {
  return (
    <div className='player-banner__container' style={props.style}>
      <div className='player-banner__result'>
        {!props.hideScore && props.infoMessage}
      </div>
      <div className='player-banner__player-image'>
        <SVGImage
          name={props.toggleValue ? 'bot' : 'human'}
          alt={props.toggleValue ? 'Computer' : 'Player'}
        />
      </div>
      <div className='player-banner__name'>{props.name}</div>
      <div className='player-banner__score-text-container'>
        {!props.hideScore && <div>Score: {props.score}</div>}
      </div>
      <div className='player-banner__ai-toggle'>
        <p className='player-banner__ai-toggle-text'>AI:</p>
        <SimpleSwitch value={props.toggleValue} toggle={props.onToggleChange} />
      </div>
    </div>
  )
}
