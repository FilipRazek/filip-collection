import React from 'react'
import './index.css'

const ThreeWaySwitch = props => {
  return (
    <div className='three-way-switch__container'>
      <input
        className='three-way-switch__switch'
        value={props.value}
        type='range'
        min='0'
        max='2'
        step='1'
        style={props.style}
        onChange={props.onChange}
      />
      <div className='three-way-switch__label-container'>
        {props.list.map((label, index) => (
          <p
            className='three-way-switch__label'
            key={label + ' ' + index}
            onClick={() => props.onClick(index)}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ThreeWaySwitch
