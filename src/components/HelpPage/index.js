import React from 'react'
import Header from '../Header'
import { HELP_DATA } from '../../constants/main'
import './index.css'

export default props => {
  const url = props.match.params.activity
  const [helpText, activityName] = HELP_DATA[url] || []

  if (!helpText) {
    window.location = '/'
    return <p>Page not found. Redirecting to home page...</p>
  }

  return (
    <div className='help-page__body'>
      <Header title={'Help for ' + activityName} noHelpLink />
      <p className='help-page__text'>{helpText}</p>
    </div>
  )
}
