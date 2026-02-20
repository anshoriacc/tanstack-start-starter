import React from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { signInBodySchema } from '@/schema/auth'
import { useLoginMutation } from '@/hooks/api/auth'
import { DemoAccountList } from './demo-account-list'
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

export const LoginForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)

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
        onSuccess: () => navigate({ to: '/dashboard', replace: true }),
      })
    },
  })

  return (
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
                  autoComplete="username"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    autoComplete="current-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <IconEyeOff /> : <IconEye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {loginMutation.isError && (
          <div
            className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
            role="alert"
          >
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
                ? 'Signing in…'
                : 'Sign in'}
            </Button>
          )}
        />
      </FieldGroup>

      <DemoAccountList
        onSelect={(user) => {
          form.setFieldValue('username', user.username)
          form.setFieldValue('password', user.password)
        }}
      />
    </form>
  )
}
