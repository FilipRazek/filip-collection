import React from 'react'
import './index.css'

export default props => {
  const { name, hint, hover, alt, clickable, onClick } = props
  const [image, setImage] = React.useState()

  React.useEffect(() => {
    const getImageData = async () => {
      const path = `/assets/${name}.svg`
      const data = await fetch(path)
      const html = await data.text()
      setImage(html)
    }
    getImageData()
  })

  return (
    <div
      className={[
        'image',
        hint && 'image-hint',
        hover && 'image-hint--visible',
        clickable && 'image--clickable',
      ]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: image }}
      alt={alt}
      onClick={clickable ? onClick : null}
    />
  )
}
