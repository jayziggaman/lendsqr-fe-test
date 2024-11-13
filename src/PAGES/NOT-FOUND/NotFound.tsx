import React from 'react'
import { Link } from 'react-router-dom'
import "./NotFound.scss"

const NotFound = () => {
  return (
    <main className="not-found-main">
      <b>
        This page does not exist
      </b>

      <Link to='/dashboard'>
        Go back to my dashboard
      </Link>
    </main>
  )
}

export default NotFound