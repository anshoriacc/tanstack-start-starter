import { Outlet, createFileRoute } from '@tanstack/react-router'

import { protectedMiddleware } from '@/middleware.ts/auth'

export const Route = createFileRoute('/_protected')({
  server: { middleware: [protectedMiddleware] },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
