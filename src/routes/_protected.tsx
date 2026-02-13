import { getCurrentUserQueryOptions } from '@/hooks/api/auth'
import { protectedMiddleware } from '@/middleware.ts/auth'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  server: { middleware: [protectedMiddleware] },
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(getCurrentUserQueryOptions)
    } catch (error) {
      console.error('Error prefetching loader', error)
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
