import { Outlet, createFileRoute } from '@tanstack/react-router'

import { protectedMiddleware } from '@/middleware.ts/auth'
import { getSessionQueryOptions } from '@/hooks/api/auth'

export const Route = createFileRoute('/_protected')({
  server: { middleware: [protectedMiddleware] },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getSessionQueryOptions)
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
