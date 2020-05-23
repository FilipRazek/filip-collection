import React from 'react'
import './index.css'

export default props => {
  return (
    <img
      className={[
        'image',
        props.hint && 'image-hint',
        props.hover && 'image-hint--visible',
        props.clickable && 'image--clickable'
      ]
        .filter(Boolean)
        .join(' ')}
      src={`/${props.name}.svg`}
      alt={props.alt}
    />
  )
}
