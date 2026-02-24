# Patterns

This document provides common patterns with code examples for this project.

## Table of Contents

1. [Authentication](#authentication)
2. [Data Fetching](#data-fetching)
3. [Forms](#forms)
4. [Protected Routes](#protected-routes)
5. [Theme](#theme)
6. [Server Functions](#server-functions)
7. [Error Handling](#error-handling)

---

## Authentication

### Client-Side Session (TanStack Query)

Use `useGetSessionQuery` for client-side auth state with TanStack Query:

```tsx
import { useGetSessionQuery } from '@/hooks/api/auth'

function Profile() {
  const { data: session, isLoading, error } = useGetSessionQuery()

  if (isLoading) return <Skeleton />
  if (error) return <Alert>{error.message}</Alert>
  if (!session) return <Redirect to="/login" />

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>{session.user.email}</p>
    </div>
  )
}
```

### Query Options for Session

```tsx
// hooks/api/auth.ts
import { queryOptions } from '@tanstack/react-query'

import { getSession } from '@/server/auth'

export const getSessionQueryOptions = queryOptions({
  queryKey: ['session'],
  queryFn: () => getSession(),
})

export const useGetSessionQuery = () => useQuery(getSessionQueryOptions)
```

### Server-Side Session (Loader)

Use in loaders for SSR:

```tsx
import { auth } from '@/lib/auth/server'

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return { user: session.user }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = Route.useLoaderData()
  return <h1>Hello, {user.name}</h1>
}
```

### Login Mutation

```tsx
// hooks/api/auth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginFn } from '@/server/auth'
import type { TSignInBody } from '@/schema/auth'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TSignInBody) => {
      const res = await loginFn({ data })
      if ('error' in res) throw res
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}

// Usage in component - navigate in onSuccess callback
import { useNavigate } from '@tanstack/react-router'

const LoginForm = () => {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const handleSubmit = (data: TSignInBody) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate({ to: '/dashboard', replace: true }),
    })
  }
}
```

### Logout Mutation

```tsx
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutFn } from '@/server/auth'

export const useLogoutMutation = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await logoutFn()
      if ('error' in res) throw res
      return res
    },
    onSuccess: () => {
      queryClient.clear()
      navigate({ to: '/login', replace: true })
    },
  })
}
```

---

## Data Fetching

### Query with Options

```tsx
// hooks/api/user.ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/server/axios'

export const getUserListQueryOptions = (params?: TGetUserListParams) =>
  queryOptions({
    queryKey: ['users', params],
    queryFn: () => api.get<TGetUserListResponse>('/users', { params }),
    staleTime: 5 * 60 * 1000,
  })

export const useGetUserListQuery = (params?: TGetUserListParams) =>
  useQuery(getUserListQueryOptions(params))

// Usage
function UserList({ params }: { params: TGetUserListParams }) {
  const { data, isLoading, error } = useGetUserListQuery(params)

  if (isLoading) return <Skeleton />
  if (error) return <Alert>{error.message}</Alert>

  return <div>{data.users.map((user) => user.name)}</div>
}
```

### Prefetch in Loader

```tsx
export const Route = createFileRoute('/users')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getUsersQueryOptions)
    return {}
  },
  component: UsersPage,
})
```

### Parallel Fetching

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const [users, posts, comments] = await Promise.all([
      context.queryClient.ensureQueryData(getUsersQueryOptions),
      context.queryClient.ensureQueryData(getPostsQueryOptions),
      context.queryClient.ensureQueryData(getCommentsQueryOptions),
    ])
    return { users, posts, comments }
  },
})
```

---

## Forms

### Form with TanStack Form

```tsx
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

// Define schema in schema/ folder
// schema/auth.ts
import z from 'zod'

export const signInBodySchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export type TSignInBody = z.infer<typeof signInBodySchema>

// Form component
import { signInBodySchema } from '@/schema/auth'
import { useLoginMutation } from '@/hooks/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'

export const LoginForm = () => {
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
      loginMutation.mutate(value)
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
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  placeholder="Enter your password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Handle mutation errors */}
        {loginMutation.isError && (
          <div
            className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
            role="alert"
          >
            {'error' in loginMutation.error && loginMutation.error.error}
          </div>
        )}

        {/* Disable button while submitting */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending
                ? 'Signing in...'
                : 'Sign in'}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
```

### Key Form Patterns

1. **Validation**: Use `onSubmit` validator, not `onChange`

   ```tsx
   validators: {
     onSubmit: signInBodySchema,
   }
   ```

2. **Controlled Input**: Don't spread props, use controlled pattern

   ```tsx
   <Input
     value={field.state.value}
     onChange={(e) => field.handleChange(e.target.value)}
     onBlur={field.handleBlur}
   />
   ```

3. **Error Display**: Check both `isTouched` and `!isValid`

   ```tsx
   const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
   ```

4. **Submit Button**: Use `form.Subscribe` for proper state
   ```tsx
   <form.Subscribe
     selector={(state) => [state.canSubmit, state.isSubmitting]}
     children={([canSubmit, isSubmitting]) => (
       <Button disabled={!canSubmit || isSubmitting}>Submit</Button>
     )}
   />
   ```

---

## Protected Routes

### Middleware Approach

```tsx
// middleware.ts/auth.ts
export const protectedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { user: session.user } })
  },
)

// Route usage
export const Route = createFileRoute('/dashboard')({
  beforeLoad: protectedMiddleware,
  component: DashboardPage,
})
```

### Layout Protection

```tsx
// routes/_protected.tsx
export const Route = createProtectedRoute({
  getParentRoute: () => rootRoute,
  beforeLoad: protectedMiddleware,
})
```

### Auth Redirect (for login pages)

```tsx
// Prevent authenticated users from accessing login
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })

  if (session) {
    throw redirect({ to: '/dashboard' })
  }

  return next()
})
```

---

## Theme

### Using Theme Hooks

```tsx
import { useTheme, useResolvedTheme } from '@/stores/theme'

function ThemeToggle() {
  const theme = useTheme() // 'light' | 'dark' | 'system'
  const resolved = useResolvedTheme() // 'light' | 'dark'

  // Toggle theme
  const setTheme = useSetTheme()

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as TTheme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  )
}
```

### Applying Theme

The theme is automatically applied via:

1. Inline script in HTML head (SSR)
2. CSS classes on `<html>` element
3. `data-theme` attribute for component styling

---

## Server Functions

### Creating Server Functions

```tsx
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth/server'
import { signInBodySchema } from '@/schema/auth'

// POST function with validation (using zod schema)
export const loginFn = createServerFn()
  .inputValidator(signInBodySchema)
  .handler(async ({ data }) => {
    const res = await auth.api.signInCredentials({ body: data })
    return res
  })

// GET function (no input)
export const getSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const res = await auth.api.getSession({ headers })
  return res
})

// POST function without validation
export const logoutFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const res = await auth.api.signOut({ headers })
  return res
})
```

### Calling Server Functions

```tsx
// Client-side - in mutations
import { loginFn } from '@/server/auth'

const mutation = useMutation({
  mutationFn: (data: TSignInBody) => loginFn({ data }),
})

// Or with direct call
const result = await loginFn({ data: { username: 'x', password: 'y' } })
```

---

## Error Handling

### Query Error Handling

```tsx
function UserList() {
  const { data, isLoading, error, refetch } = useQuery(getUsersQueryOptions)

  if (isLoading) return <Skeleton />

  if (error)
    return (
      <Alert>
        <AlertTitle>Error loading users</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <Button onClick={() => refetch()}>Retry</Button>
      </Alert>
    )

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Mutation Error Handling

```tsx
const mutation = useMutation({
  mutationFn: loginFn,
  onError: (error) => {
    toast.error(error.message)
  },
})

// Access error state
if (mutation.isError) {
  return <Alert>{mutation.error.message}</Alert>
}
```

### Form Validation Errors

Display validation errors only when field is touched and invalid:

```tsx
<form.Field
  name="email"
  render={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
      <Field data-invalid={isInvalid}>
        <Input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

### Server Validation Errors

Handle server-side errors from mutations:

```tsx
const mutation = useMutation({
  mutationFn: loginFn,
  onError: (error) => {
    toast.error(error.message)
  },
})

// Or handle in component
{
  mutation.isError && (
    <Alert>{'error' in mutation.error && mutation.error.error}</Alert>
  )
}
```
