import React from 'react'
import SVGImage from '../SVGImage'
import './index.css'

const Cell = props => {
  const value = props.value ? props.value : props.turn
  const name = ['circle', 'cross'][value - 1]
  const alt = ['O', 'X'][value - 1]
  const [hover, setHover] = React.useState(false)

  return (
    <div
      className={[
        'cell',
        props.playable && !hover && 'cell--playable',
        props.wonCircle && 'cell--won-circle',
        props.wonCross && 'cell--won-cross',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={props.onClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {props.value === 0 ? (
        <SVGImage hint hover={hover && props.playable} name={name} alt={alt} />
      ) : (
        <SVGImage name={name} alt={alt} />
      )}
    </div>
  )
}

export default Cell
