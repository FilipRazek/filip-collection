import React from 'react'
import SVGImage from '../SVGImage'
import './index.css'

const FlashCard = React.forwardRef((props, ref) => {
  const [hover, setHover] = React.useState(false)
  const helpTextData = props.isSymbol
    ? { _: 'Underscore', '-': 'Minus', '.': 'Period' }
    : { '-': 'Dash', '.': 'Dot' }
  const helpText = helpTextData[props.text]
  const defaultColor = props.defaultColor || 'light-light-blue'

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
            ? `var(--${defaultColor})`
            : `var(--light-${defaultColor})`,
        '--animate-color': `var(--${props.animateColor})`,
        '--animation-duration': props.animationDuration,
      }}
    >
      {props.text === 'Backspace' ? (
        <SVGImage
          clickable={props.clickable}
          name='backspace'
          alt='Backspace'
        />
      ) : props.isInput ? (
        <input
          ref={ref}
          autoFocus={props.autoFocus}
          onFocus={props.onFocus}
          onChange={props.onChange}
          className='flash-card__input'
          value={props.text}
        ></input>
      ) : (
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
})

export default FlashCard
