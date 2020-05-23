import React from 'react'
import './index.css'

const SimpleSwitch = props => {
  // After toggling an onClick is always called. To prevent reverting the
  // switch position we store if the last action was a toggle
  // Note: We keep the input as a toggle to allow the user to drag the thumb
  const [hasJustBeenToggled, setHasJustBeenToggled] = React.useState(false)

  return (
    <div
      className='simple-switch__container'
      onClick={
        hasJustBeenToggled ? () => setHasJustBeenToggled(false) : props.toggle
      }
    >
      <input
        className='simple-switch__switch'
        value={props.value ? '1' : '0'}
        type='range'
        min='0'
        max='1'
        step='1'
        style={{
          '--switch-color': `var(--${props.value ? (props.isInvalid ? 'light-error' : 'blue') : 'gray'}`,
        }}
        onChange={() => {
          setHasJustBeenToggled(true)
          props.toggle()
        }}
      />
    </div>
  )
}

export default SimpleSwitch
