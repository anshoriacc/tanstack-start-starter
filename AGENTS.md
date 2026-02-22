# AGENTS.md

This file contains rules and guidelines for AI agents working on this codebase.

## Overview

This is a TanStack Start boilerplate with:

- TanStack Router (file-based type-safe routing)
- TanStack Query v5 (data fetching)
- TanStack Form (form handling)
- Better Auth (authentication)
- TailwindCSS v4 + shadcn/ui components

## Performance Rules (Vercel Best Practices)

Follow these priority rules when writing or reviewing code:

### Critical (Bundle Size)

1. **Avoid barrel imports** - Import directly from component files, not index files

   ```tsx
   // Good
   import { Button } from '@/components/ui/button'

   // Avoid
   import { Button } from '@/components/ui'
   ```

2. **Use dynamic imports for heavy components** - Lazy load chart, calendar, date-picker, command palette

   ```tsx
   import { lazy } from 'react'
   const Chart = lazy(() => import('@/components/ui/chart'))
   ```

### High Priority (Server-Side)

4. **Parallel data fetching** - Fetch independent data in parallel

   ```tsx
   // Good - parallel
   const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])

   // Avoid - sequential
   const users = await fetchUsers()
   const posts = await fetchPosts()
   ```

5. **Minimize props passed to client components** - Keep RSC payloads small

### Medium Priority (Client)

6. **Use query key factories** - Consistent, reusable query keys

   ```tsx
   const userKeys = {
     all: ['users'] as const,
     lists: () => [...userKeys.all, 'list'] as const,
     details: (id: string) => [...userKeys.all, 'detail', id] as const,
   }
   ```

7. **Configure staleTime** - Avoid unnecessary refetches
   ```tsx
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000, // 5 minutes
       },
     },
   })
   ```

## Code Conventions

### File Naming

- Components: `PascalCase` (e.g., `LoginForm.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAuth.ts`)
- Utils: `camelCase` (e.g., `query-client.ts`)
- Routes: `kebab-case` (e.g., `login/index.tsx`)

### Component Declaration

- Page/layout/route components: use `function`
  ```tsx
  function LoginPage() { ... }
  function DashboardLayout() { ... }
  ```
- All other components: use `const`
  ```tsx
  export const Header = () => { ... }
  export const LoginForm = () => { ... }
  ```

### Import Aliases

Use `@/` for root imports:

```tsx
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'
import { useLoginMutation } from '@/hooks/api/auth'
```

### Route Structure

Routes are file-based using TanStack Router:

- `src/routes/` - Route files
- `_prefix/` - Route groups (layout wrappers)
- `index.tsx` - Route index
- `-components/` - Route-specific components

Example:

```
src/routes/
├── _auth/
│   └── login/
│       ├── index.tsx       # /login
│       └── -components/
│           └── login-form.tsx
└── _protected/
    └── _dashboard/
        └── dashboard.tsx  # /dashboard
```

## Auth Patterns

### Client-Side Auth (useSession)

```tsx
import { useSession } from '@/lib/auth/client'

const Profile = () => {
  const { data: session, isLoading } = useSession()

  if (isLoading) return <Skeleton />
  if (!session) return <Redirect to="/login" />

  return <div>{session.user.name}</div>
}
```

### Server-Side Auth (in loaders)

```tsx
import { auth } from '@/lib/auth/server'

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const session = await auth.api.getSession({ headers })
    if (!session) throw redirect('/login')
    return { user: session.user }
  },
})
```

### Protected Routes Middleware

```tsx
// src/middleware.ts/auth.ts
export const protectedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const session = await auth.api.getSession({ headers })
    if (!session) throw redirect('/login')
    return next({ context: { user: session.user } })
  },
)
```

## Data Fetching Patterns

### Query with Options

```tsx
// hooks/api/user.ts
export const getUserQueryOptions = queryOptions({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,
})

export const useUserQuery = () => useQuery(getUserQueryOptions(userId))
```

### Mutation with Invalidation

```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
  },
})
```

## Theme System

Theme is SSR-safe using inline script to prevent flash:

1. Server sends theme in loader
2. Inline script applies theme before hydration
3. Zustand store manages client-side theme state
4. Use `useTheme()` and `useResolvedTheme()` hooks

```tsx
import { useTheme, useResolvedTheme } from '@/stores/theme'

const Toggle = () => {
  const theme = useTheme()
  const resolved = useResolvedTheme()

  // theme: 'light' | 'dark' | 'system'
  // resolved: 'light' | 'dark'
}
```

## DevTools Integration

DevTools are automatically excluded from production builds by TanStack DevTools:

```tsx
// In __root.tsx - works in both dev and production
import { TanStackDevtools } from '@tanstack/react-devtools'

<TanStackDevtools ... />
```

## Testing

Run tests with Vitest:

```bash
pnpm test
```

Test files should be colocated:

```
src/
├── components/
│   └── button/
│       ├── button.tsx
│       └── button.test.tsx
```

## Before Submitting Work

1. Run `pnpm check` - lint & format
2. Run `pnpm test` - ensure tests pass
3. Verify no console errors in dev mode

## Additional Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Conventions](./docs/CONVENTIONS.md)
- [Patterns](./docs/PATTERNS.md)
