import React from 'react'
import { useParams } from 'react-router-dom'

const UserPage = ({ users }) => {
  const id = useParams().id
  const user = users.find(u => u.id === id)
  if (!user) return null
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Added blogs: {user.blogs.length}</p>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default UserPage