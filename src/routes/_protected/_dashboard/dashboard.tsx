import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth/client'
import { useGetCurrentUserQuery } from '@/hooks/api/auth'

export const Route = createFileRoute('/_protected/_dashboard/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const session = useSession()

  const currentUserQuery = useGetCurrentUserQuery()

  return (
    <main>
      <pre className="w-full overflow-x-scroll">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  )
}
