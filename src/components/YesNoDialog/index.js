import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '../Button'
import './index.css'

export default props => {
  const { onYes, onClose, open, text } = props

  const handleKeyEvent = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onYes()
    }
  }
  const removeListener = () => {
    window.removeEventListener('keydown', handleKeyEvent)
  }
  const handleListener = () => {
    if (open) window.addEventListener('keydown', handleKeyEvent)
    return removeListener
  }

  React.useEffect(handleListener)

  return (
    <Dialog
      open={open}
      onClose={() => {
        removeListener()
        onClose()
      }}
      aria-labelledby='confirm-manual-dialog'
    >
      <div className='confirm-manual-dialog__container'>
        <p className='confirm-manual-dialog__text'>{text}</p>
        <div className='confirm-manual-dialog__actions'>
          <Button
            onClick={() => {
              removeListener()
              onYes()
            }}
            defaultStyles
            text='Yes'
          />
          <Button
            onClick={() => {
              removeListener()
              onClose()
            }}
            secondaryStyles
            text='No'
          />
        </div>
      </div>
    </Dialog>
  )
}
