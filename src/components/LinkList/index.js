import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

export default props => {
  return (
    <nav>
      <ul className='link-list__list'>
        {props.links.map(
          link =>
            link.label && (
              <li key={link.path}>
                <Link className='link-list__link' to={link.path}>
                  {link.label}
                </Link>
              </li>
            )
        )}
      </ul>
    </nav>
  )
}
