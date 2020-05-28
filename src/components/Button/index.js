import React from 'react'
import './index.css'

export default props => {
  return (
    <button
      data-for={props['data-for']}
      data-tip={props['data-tip']}
      className={[
        'button',
        props.defaultStyles && 'button--default',
        props.defaultRedStyles && 'button--default-red',
        props.secondaryStyles && 'button--secondary',
        props.defaultStyles && props.disabled && 'button--default-disabled',
        ...(props.className || []),
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={props.disabled ? undefined : props.onClick}
    >
      {props.text}
    </button>
  )
}
