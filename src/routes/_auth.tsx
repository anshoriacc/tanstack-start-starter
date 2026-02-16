import { Outlet, createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/middleware.ts/auth'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  server: { middleware: [authMiddleware] },
})

function RouteComponent() {
  return <Outlet />
}
