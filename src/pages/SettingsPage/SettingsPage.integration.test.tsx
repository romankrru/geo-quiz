import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { GamePage } from '../GamePage/GamePage'
import { HomePage } from '../HomePage/HomePage'

import { SettingsPage } from './SettingsPage'

vi.mock('@shared/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@shared/hooks')>()),
  useSfx: () => vi.fn(),
}))

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

function renderApp() {
  const rootRoute = createRootRoute({ component: Outlet })
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
  })
  const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage,
  })
  const gameRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/game',
    component: GamePage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, settingsRoute, gameRoute]),
    history: createMemoryHistory({ initialEntries: ['/settings'] }),
  })

  render(<RouterProvider router={router} />)
}

it('starts a new round with the selected Configured round size', async () => {
  renderApp()

  fireEvent.click(await screen.findByRole('radio', { name: /Classic/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

  expect(
    await screen.findByRole('heading', {
      name: 'Which country does this flag belong to?',
    }),
  ).toBeInTheDocument()
  expect(screen.getByText('Progress: 0 / 25')).toBeInTheDocument()
})

it('discards an unsaved selection when returning to the start screen', async () => {
  renderApp()

  fireEvent.click(await screen.findByRole('radio', { name: /Classic/ }))
  fireEvent.click(screen.getByRole('link', { name: 'Back to Start' }))
  fireEvent.click(await screen.findByRole('link', { name: 'Settings' }))

  expect(await screen.findByRole('radio', { name: /Quick play/ })).toBeChecked()
})
