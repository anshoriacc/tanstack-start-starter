import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth/client'
import { useGetCurrentUserQuery, useGetSessionQuery } from '@/hooks/api/auth'

export const Route = createFileRoute('/_protected/_dashboard/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  // const session = useSession()

  const currentUserQuery = useGetCurrentUserQuery()

  const sessionQuery = useGetSessionQuery()

  return (
    <div className="w-full p-4">
      {/* <pre className="w-full overflow-x-scroll dark:bg-red-900 bg-red-100 w-full">
        {JSON.stringify(session, null, 2)}
      </pre> */}
      <pre className="w-full overflow-x-scroll dark:bg-amber-900 bg-amber-100">
        {JSON.stringify(sessionQuery.data, null, 2)}
      </pre>
      <pre className="w-full overflow-x-scroll dark:bg-blue-900 bg-blue-100">
        {JSON.stringify(currentUserQuery.data, null, 2)}
      </pre>
    </div>
  )
}
