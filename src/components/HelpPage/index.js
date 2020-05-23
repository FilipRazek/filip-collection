import React from 'react'
import Header from '../Header'
import './index.css'

export default () => {
  // TODO: Add back button
  return (
    <div className='help-page__body'>
      <Header title='Help' noHelpLink />
      <p>No help was provided for this activity.</p>
    </div>
  )
}
