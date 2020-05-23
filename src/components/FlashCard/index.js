import React from 'react'
import './index.css'
import SVGImage from '../SVGImage'

const FlashCard = props => {
  const [hover, setHover] = React.useState(false)
  const helpTextData = props.isSymbol
    ? { _: 'Underscore', '-': 'Minus', '.': 'Period' }
    : { '-': 'Dash', '.': 'Dot' }
  const helpText = helpTextData[props.text]

  return (
    <div
      className={[
        'flash-card',
        props.small && 'flash-card--small',
        props.medium && 'flash-card--medium',
        props.clickable && 'flash-card--clickable',
        props.changeColor && 'flash-card--change-color',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={props.onClick}
      onAnimationEnd={props.onAnimationEnd}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      style={{
        '--color':
          hover && !props.unhoverable
            ? 'var(--light-light-blue)'
            : 'var(--light-light-light-blue)',
        '--animate-color': `var(--${props.animateColor})`,
        '--animation-duration': props.animationDuration,
      }}
    >
      {props.text === 'Backspace' && (
        <SVGImage
          clickable={props.clickable}
          name='backspace'
          alt='Backspace'
        />
      )}
      {props.text !== 'Backspace' && (
        <p className='flash-card__text'>{props.text}</p>
      )}
      {helpText && !props.small && (
        <p
          className={[
            'flash-card__help-text',
            props.medium && 'flash-card__help-text--medium',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {helpText}
        </p>
      )}
    </div>
  )
}

export default FlashCard
