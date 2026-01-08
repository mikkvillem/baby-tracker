import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../app.css'

export const Route = createRootRoute({
  component: () => (
    <div class="min-h-screen bg-gray-100 p-4 sm:p-5">
      <Outlet />
    </div>
  )
})

