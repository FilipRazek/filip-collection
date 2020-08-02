import React from 'react'
import InfoTile from '../InfoTile'
import './index.css'

export default props => {
  return (
    <div className='link-list__list'>
      {props.links.map(
        link =>
          link.label && (
            <InfoTile
              to={link.path}
              image={link.image || 'circle'}
              label={link.label}
            ></InfoTile>
          )
      )}
    </div>
  )
}
