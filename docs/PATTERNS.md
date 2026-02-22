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

### Client-Side Session

Use `useSession` hook for client-side auth state:

```tsx
import { useSession } from '@/lib/auth/client'

function Profile() {
  const { data: session, isLoading, error } = useSession()

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
export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: TSignInBody) => {
      const res = await loginFn({ data })
      if ('error' in res) throw res.error
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      navigate({ to: '/dashboard' })
    },
  })
}

// Usage in component
const loginMutation = useLoginMutation()
const handleSubmit = (data: TSignInBody) => {
  loginMutation.mutate(data)
}
```

### Logout Mutation

```tsx
export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const res = await logoutFn()
      if ('error' in res) throw res.error
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
export const getUserQueryOptions = queryOptions({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

export const useUserQuery = (userId: string) =>
  useQuery(getUserQueryOptions(userId))

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUserQuery(userId)

  if (isLoading) return <Skeleton />
  if (error) return <Alert>{error.message}</Alert>

  return <div>{user.name}</div>
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

### Basic Form with TanStack Form

```tsx
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        form.handleSubmit(e)
      }}
    >
      <form.Field
        name="email"
        render={(field) => (
          <>
            <Input
              {...field.getInputProps()}
              type="email"
              placeholder="Email"
            />
            {field.getMeta().errors && <Alert>{field.getMeta().errors}</Alert>}
          </>
        )}
      />
      <form.Field
        name="password"
        render={(field) => (
          <>
            <Input
              {...field.getInputProps()}
              type="password"
              placeholder="Password"
            />
          </>
        )}
      />
      <Button type="submit">Login</Button>
    </form>
  )
}
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

// GET function
export const getDataFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const data = await fetchData(headers)
  return data
})

// POST function with validation
export const updateDataFn = createServerFn()
  .inputValidator(z.object({ id: z.string(), name: z.string() }))
  .handler(async ({ data }) => {
    const result = await updateData(data)
    return result
  })
```

### Calling Server Functions

```tsx
// Client-side
import { updateDataFn } from '@/server/data'

// In handler or effect
const result = await updateDataFn({ data: { id: '1', name: 'New' } })

// With loading state
const mutation = useMutation({
  mutationFn: (data: { id: string; name: string }) => updateDataFn({ data }),
})
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

```tsx
<form.Field
  name="email"
  render={(field) => (
    <>
      <Input {...field.getInputProps()} />
      {field.getMeta().isTouched && field.getMeta().errors && (
        <span className="text-red-500">{field.getMeta().errors}</span>
      )}
    </>
  )}
/>
```

---

## Further Reading

- [Architecture](./ARCHITECTURE.md) - High-level architecture
- [Conventions](./CONVENTIONS.md) - Code conventions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
