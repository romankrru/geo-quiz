import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function HomePage() {
    return (
      <div>
        <h1>Geo Quiz</h1>
        <Link to="/game">Start Game</Link>
      </div>
    )
  },
})

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: function GamePage() {
    return (
      <div>
        <h1>Game</h1>
      </div>
    )
  },
})

const routeTree = rootRoute.addChildren([indexRoute, gameRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
