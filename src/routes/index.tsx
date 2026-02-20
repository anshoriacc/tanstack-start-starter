import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'
import { cn } from '@/lib/utils'
import { MotionContainer, MotionItem } from '@/components/ui/motion'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main
      className={cn(
        'min-h-screen',
        'bg-[linear-gradient(to_right,var(--sidebar)_1px,transparent_1px),linear-gradient(to_bottom,var(--sidebar)_1px,transparent_1px)] bg-size-[1rem_1rem]',
      )}
    >
      <MotionContainer className="container mx-auto py-12">
        <MotionItem className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Tanstack Start Starter
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Tanstack Start Starter with Better Auth and Shadcn/UI
          </p>
        </MotionItem>

        <ComponentExample />
      </MotionContainer>
    </main>
  )
}
