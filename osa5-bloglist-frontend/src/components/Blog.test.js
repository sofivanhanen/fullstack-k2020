import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

const someUser = {
  name: 'Sofi'
}

const someBlog = {
  author: 'Charles Dickens',
  title: 'Oliver, and other Twists',
  url: 'www.ot.com',
  likes: 10,
  user: someUser
}

const someAction = () => { }

const notExactOptions = {
  exact: false
}

test('renders title and author', () => {
  const component = render(
    <Blog
      blog={someBlog}
      likeAction={someAction}
      deleteAction={someAction}
      isOwned={someAction} />
  )

  expect(component.getByText('Charles Dickens', notExactOptions)).toBeVisible()
  expect(component.getByText('Oliver, and other Twists', notExactOptions)).toBeVisible()
})

test('does not render url or likes by default', () => {
  const component = render(
    <Blog
      blog={someBlog}
      likeAction={someAction}
      deleteAction={someAction}
      isOwned={someAction} />
  )

  expect(component.getByText('www.ot.com', notExactOptions)).not.toBeVisible()
  expect(component.getByText('Likes:', notExactOptions)).not.toBeVisible()
})