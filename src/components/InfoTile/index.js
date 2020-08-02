import React from 'react'
import { Link } from 'react-router-dom'
import SVGImage from '../SVGImage'
import './index.css'

export default props => {
  return (
    <div className='info-tile__container' style={props.style}>
      <div className='info-tile__label'>
        <Link to={props.to}>{props.label}</Link>
      </div>
      <div className='info-tile__image'>
        <SVGImage name={props.image} alt={props.imageName} />
      </div>
    </div>
  )
}
