import React from 'react'
import ReactTooltip from 'react-tooltip'
import Dialog from '@material-ui/core/Dialog'
import Button from '../Button'
import './index.css'

export default props => {
  const {
    onConfirm,
    onCancel,
    open,
    text,
    content,
    confirmDisabledMessage,
    cancelText,
    confirmText,
  } = props

  const handleKeyEvent = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onConfirm()
      return removeListener
    }
  }
  const handleListener = () => {
    if (open) window.addEventListener('keydown', handleKeyEvent)
    return removeListener
  }
  const removeListener = () =>
    window.removeEventListener('keydown', handleKeyEvent)

  React.useEffect(handleListener)

  return (
    <Dialog
      open={open}
      onClose={() => {
        removeListener()
        onCancel()
      }}
      aria-labelledby='settings-dialog'
      fullWidth
    >
      <div className='settings-dialog__container'>
        <p className='settings-dialog__text'>{text}</p>
        {content}
        <div className='settings-dialog__actions'>
          <Button
            data-for='confirm-button'
            data-tip
            onClick={() => {
              removeListener()
              onConfirm()
            }}
            defaultStyles
            disabled={confirmDisabledMessage}
            text={confirmText}
          />
          <Button
            onClick={() => {
              removeListener()
              onCancel()
            }}
            secondaryStyles
            text={cancelText}
          />
          {confirmDisabledMessage && (
            <ReactTooltip id='confirm-button' place='top' effect='solid'>
              {confirmDisabledMessage}
            </ReactTooltip>
          )}
        </div>
      </div>
    </Dialog>
  )
}
