import React from 'react'
import Header from '../Header'
import LinkList from '../LinkList'
import './index.css'

export default props => {
  // TODO: Use Banners to represent activities
  const activitiesCount = props.links.filter(activity => activity.label).length

  return (
    <div className='home__container'>
      <Header noLinkHome title='Welcome!' helpPath='/about' />
      <p className='home__text'>
        There {activitiesCount === 1 ? 'is' : 'are'} currently {activitiesCount}{' '}
        {activitiesCount === 1 ? 'activity' : 'activities'} available on this
        website.
        <br />
        Come back later for more!
      </p>
      <LinkList links={props.links} />
    </div>
  )
}
