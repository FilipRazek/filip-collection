import React from 'react'
import Header from '../Header'
import './index.css'

export default () => {
  return (
    <div className='about-page__body'>
      <Header title='About' noHelpLink />
      <p>This is an empty about page.</p>
    </div>
  )
}
