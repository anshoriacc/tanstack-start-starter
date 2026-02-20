import { createFileRoute } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { ToggleTheme } from '@/components/toggle-theme'
import {
  CardContent,
  CardDescription,
  Card,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { LoginForm } from './-components/login-form'

export const Route = createFileRoute('/_auth/login/')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center gap-6 p-4',
        'bg-[linear-gradient(to_right,var(--sidebar)_1px,transparent_1px),linear-gradient(to_bottom,var(--sidebar)_1px,transparent_1px)] bg-size-[1rem_1rem]',
      )}
    >
      <MotionContainer
        as="div"
        className="flex w-full flex-1 flex-col items-center justify-center"
      >
        <MotionItem className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </MotionItem>
      </MotionContainer>

      <ToggleTheme />
    </main>
  )
}
