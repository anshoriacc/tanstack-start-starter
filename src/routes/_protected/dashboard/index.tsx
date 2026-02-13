import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth/client'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const session = useSession()

  return <div>{JSON.stringify(session, null, 2)}</div>
}
