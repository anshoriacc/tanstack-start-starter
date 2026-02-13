import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'
import { ToggleTheme } from '@/components/toggle-theme'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="flex flex-col space-y-12 items-center">
      <ComponentExample />
      <ToggleTheme />
    </main>
  )
}
