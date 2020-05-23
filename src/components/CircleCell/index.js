import React from 'react'
import ReactTooltip from 'react-tooltip'
import './index.css'

const CircleCell = props => {
  const isAnimationRunning = () => [1, 2, 3].includes(props.animationStep)
  return (
    <>
      <div
        data-for={`circle-${props.value}-tooltip`}
        data-tip
        style={props.style}
        className={[
          'circle',
          props.big && 'circle--big',
          props.clickable && !props.messageInTooltip && 'circle--clickable',
          props.disabled && 'circle--disabled',
          !isAnimationRunning() && props.state === 1 && 'circle--won',
          !isAnimationRunning() && props.state === 2 && 'circle--lost',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={props.messageInTooltip ? null : props.onClick}
      >
        <p
          className={[
            'circle__text',
            props.animationStep &&
              (props.animationStep % 2) - 1 &&
              'circle__text--appear',
            props.animationStep % 2 && 'circle__text--disappear',
            props.clickable && !props.messageInTooltip && 'circle__text--clickable',
          ]
            .filter(Boolean)
            .join(' ')}
          onAnimationEnd={props.onAnimationEnd}
          style={props.style}
        >
          {props.value}
        </p>
      </div>
      {props.messageInTooltip && (
        <ReactTooltip
          id={`circle-${props.value}-tooltip`}
          place='bottom'
          effect='solid'
        >
          {props.messageInTooltip}
        </ReactTooltip>
      )}
    </>
  )
}

export default CircleCell
