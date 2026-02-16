import { Outlet, createFileRoute } from '@tanstack/react-router'

import { protectedMiddleware } from '@/middleware.ts/auth'
import { getSessionQueryOptions } from '@/hooks/api/auth'
import { sleep } from '@/lib/utils'

export const Route = createFileRoute('/_protected')({
  server: { middleware: [protectedMiddleware] },
  loader: async ({ context }) => {
    try {
      await sleep(2000)
      await context.queryClient.ensureQueryData(getSessionQueryOptions)
    } catch (error) {
      console.error('Error prefetching loader', error)
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
