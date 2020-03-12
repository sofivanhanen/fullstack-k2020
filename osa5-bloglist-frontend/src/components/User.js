import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <div>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
      , blogs: {user.blogs.length}
    </div>
  )
}

export default User