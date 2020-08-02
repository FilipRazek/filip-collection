import React from 'react'
import { Link } from 'react-router-dom'
import SVGImage from '../SVGImage'
import './index.css'

export default props => {
  return (
    <div className='info-tile__top-container'>
      <Link to={props.to} className='info-tile__link'>
        <div className='info-tile__container'>
          <div className='info-tile__label'>{props.label}</div>
          <div className='info-tile__image'>
            <SVGImage clickable name={props.image} alt={props.label} />
          </div>
        </div>
      </Link>
    </div>
  )
}
