import React from 'react'
import { Link } from 'react-router-dom'
import SVGImage from '../SVGImage'
import './index.css'

export default props => {
  // TODO: Add fade-in effect on hover to home page
  return (
    <div className='header__container'>
      <div className='header__left-icons'>
        {!props.noLinkHome && (
          <Link className='header__icon' to='/'>
            <SVGImage clickable name='home' alt='Home' />
          </Link>
        )}
      </div>
      <div className='header__title'>
        <p className='header__item'>{props.title}</p>
      </div>
      <div className='header__right-icons'>
        {props.noHelpLink ? (
          <Link
            className='header__icon'
            to={
              window.location.pathname.substring(0, 5) === '/help'
                ? window.location.pathname.substring(5)
                : '/'
            }
          >
            <SVGImage clickable name='back' alt='Help' />
          </Link>
        ) : (
          <Link className='header__icon' to={'help' + window.location.pathname}>
            <SVGImage clickable name='help' alt='Help' />
          </Link>
        )}
      </div>
    </div>
  )
}
