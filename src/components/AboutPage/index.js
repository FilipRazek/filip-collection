import React from 'react'
import Header from '../Header'
import './index.css'

export default () => {
  return (
    <div className='about-page__body'>
      <Header title='About' noHelpLink />
      <p>Welcome to my website! I publish my small React projects here.</p>
    </div>
  )
}
