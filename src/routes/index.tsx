import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'
import { cn } from '@/lib/utils'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import { IconBrandGithub } from '@tabler/icons-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main
      className={cn(
        'min-h-screen',
        'bg-[linear-gradient(to_right,var(--sidebar)_1px,transparent_1px),linear-gradient(to_bottom,var(--sidebar)_1px,transparent_1px)] bg-size-[1rem_1rem]',
      )}
    >
      <MotionContainer className="container mx-auto space-y-12 py-12">
        <MotionItem className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Tanstack Start Starter
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Tanstack Start Starter with Better Auth and Shadcn/UI
          </p>
          <Button
            variant="secondary"
            render={
              <a
                href="https://github.com/anshoriacc/tanstack-start-starter"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <IconBrandGithub />
            GitHub
          </Button>
        </MotionItem>

        <ComponentExample />
      </MotionContainer>
    </main>
  )
}
