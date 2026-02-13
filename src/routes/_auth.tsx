import { authMiddleware } from '@/middleware.ts/auth'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  server: { middleware: [authMiddleware] },
})

function RouteComponent() {
  return <Outlet />
}
