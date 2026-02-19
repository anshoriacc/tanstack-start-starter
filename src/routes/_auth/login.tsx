import React from 'react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { signInBodySchema } from '@/schema/auth'
import { useLoginMutation } from '@/hooks/api/auth'
import { ToggleTheme } from '@/components/toggle-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  InputGroupButton,
  InputGroupInput,
  InputGroup,
  InputGroupAddon,
} from '@/components/ui/input-group'
import {
  FieldError,
  FieldGroup,
  Field,
  FieldLabel,
} from '@/components/ui/field'
import {
  CardContent,
  CardDescription,
  Card,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const loginMutation = useLoginMutation()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onSubmit: signInBodySchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value, {
        onSuccess: () => {
          navigate({ to: '/dashboard', replace: true })
        },
      })
    },
  })

  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center gap-6 p-4',
        'bg-[linear-gradient(to_right,var(--sidebar)_1px,transparent_1px),linear-gradient(to_bottom,var(--sidebar)_1px,transparent_1px)] bg-size-[1rem_1rem]',
      )}
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <form.Field name="username">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          placeholder="Enter your username"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>

                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            placeholder="Enter your password"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              size="icon-sm"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? <IconEyeOff /> : <IconEye />}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>

                {loginMutation.isError && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                    {'error' in loginMutation.error &&
                      typeof loginMutation.error.error === 'string' &&
                      loginMutation.error.error}
                  </div>
                )}

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([_, isSubmitting]) => (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || loginMutation.isPending}
                    >
                      {isSubmitting || loginMutation.isPending
                        ? 'Signing in...'
                        : 'Sign in'}
                    </Button>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <ToggleTheme />
    </main>
  )
}
