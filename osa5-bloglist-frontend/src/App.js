import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import UserPage from './components/UserPage'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import './App.css'
import { Page, Navigation, Button } from './styles/Style'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [changes, setChanges] = useState(0)
  const [notification, setNotification] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(blogs)
      })
  }, [changes])

  useEffect(() => {
    userService.getAll()
      .then(users => {
        setUsers(users)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (exception) {
      setNotification(
        `Login failed: ${exception.response.data.error}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleNewBlog = async (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    try {
      const blog = {
        author: author,
        title: title,
        url: url
      }
      await blogService.create(blog)
      setChanges(changes + 1)
      setNotification(
        'Blog added!'
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification(
        `Couldn't add blog: ${exception.response.data.error}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      await blogService.put(blog.id, newBlog)
      setChanges(changes + 1)
      setNotification(
        'Blog liked!'
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification(
        `Couldn't like blog: ${exception.response.data.error}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(`Delete ${blog.title}?`)
    if (!confirmed) return
    try {
      await blogService.remove(blog.id)
      setChanges(changes + 1)
      setNotification(
        'Blog deleted!'
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification(
        `Couldn't delete blog: ${exception.response.data.error}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const logout = () => {
    setUser(null)
    blogService.setToken('')
    window.localStorage.removeItem('loggedUser')
    setNotification(
      'Logged out!'
    )
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const isOwned = blog => {
    return blog.user.username === user.username
  }

  const padding = {
    padding: 5
  }

  return (
    <Page>
      <Router>
        <Navigation>
          <Link style={padding} to="/">Home</Link>
          <Link style={padding} to="/users">Users</Link>
          {user
            ? <span>{user.name} logged in <Button onClick={logout}>Logout</Button></span>
            : null}
        </Navigation>
        <Notification message={notification} />
        <Switch>
          <Route path="/users/:id">
            <UserPage users={users} />
          </Route>
          <Route path="/users">
            <UserList users={users} />
          </Route>
          <Route path="/">
            {user === null ?
              <LoginForm loginAction={handleLogin} /> :
              <div>
                <Togglable buttonLabel="New blog" ref={blogFormRef}>
                  <BlogForm createAction={handleNewBlog} />
                </Togglable>
                <BlogList
                  blogs={blogs}
                  likeAction={handleLike}
                  deleteAction={handleDelete}
                  isOwned={isOwned}
                />
              </div>
            }
          </Route>
        </Switch>
      </Router>
    </Page>
  )
}

export default App