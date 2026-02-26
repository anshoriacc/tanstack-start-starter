# Conventions

This document outlines the code conventions and patterns used in this project.

## File Naming

Use **kebab-case** for all file names, with these exceptions:

- **Auto-generated files** - Keep as-is (e.g., `routeTree.gen.ts`)
- **TanStack Router conventions** - Follow Router semantics:
  - `__root.tsx` - Root route
  - `_prefix` - Route layout groups
  - `-components` - Route-specific component directories
  - `index.tsx` - Route files

| Type       | Convention                    | Example                                 |
| ---------- | ----------------------------- | --------------------------------------- |
| Components | kebab-case                    | `login-form.tsx`, `user-profile.tsx`    |
| Hooks      | kebab-case with `use` prefix  | `use-mobile.ts`, `use-auth.ts`          |
| Utils      | kebab-case                    | `query-client.ts`, `request-handler.ts` |
| Routes     | kebab-case                    | `login/index.tsx`, `dashboard.tsx`      |
| Stores     | kebab-case                    | `theme.ts`, `command.ts`                |
| Schemas    | kebab-case with schema suffix | `auth.ts`, `user.ts`                    |

## Folder Structure

### Components

```
src/components/
├── ui/                    # shadcn-style components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── -components/           # Route-specific components (hidden)
├── component-name.tsx     # Shared components
└── index.ts               # Avoid barrel imports
```

### Hooks

```
src/hooks/
├── api/                   # Data fetching hooks
│   ├── auth.ts
│   └── user.ts
├── use-mobile.ts
└── use-feature.ts
```

### Routes

```
src/routes/
├── _prefix/              # Route groups (layout wrappers)
│   ├── _auth/
│   │   ├── index.tsx     # /auth (redirect)
│   │   └── login/
│   │       ├── index.tsx
│   │       └── -components/
│   └── _protected/
│       ├── index.tsx     # /protected (redirect)
│       └── _dashboard/
│           ├── index.tsx
│           └── dashboard.tsx
├── index.tsx             # / (home)
└── __root.tsx           # Root route
```

## Import Conventions

### Use `@/` Alias

```tsx
// Good
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'
import { useLoginMutation } from '@/hooks/api/auth'

// Avoid
import { Button } from '../../components/ui/button'
```

### Direct Imports (No Barrel Files)

```tsx
// Good - import directly from file
import { Button } from '@/components/ui/button'

// Avoid - import from index barrel
import { Button } from '@/components/ui'
```

### Heavy Components - Lazy Load

```tsx
// Good - lazy load heavy components
import { lazy, Suspense } from 'react'
const Chart = lazy(() => import('@/components/ui/chart'))

const Dashboard = () => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <Chart />
    </Suspense>
  )
}
```

## TypeScript Conventions

### Use Type Inference

```tsx
// Good - let TypeScript infer types
const user = await fetchUser(id)
const { data, isLoading } = useQuery(getUserQueryOptions(id))

// Avoid - redundant type annotations
const user: User = await fetchUser(id)
```

### Define Types for External Data

```tsx
// Define types for API responses
type TUserResponse = {
  id: number
  name: string
  email: string
}

// Use in query options
export const getUserQueryOptions = queryOptions<TUserResponse>({
  queryKey: ['user'],
  queryFn: () => api.get('/user'),
})
```

### Use Zod for Validation

```tsx
// schema/auth.ts
import { z } from 'zod'

export const signInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

## React Conventions

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

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react'

// 2. Types (if needed)
type Props = {
  title: string
  onSubmit: () => void
}

// 3. Component
export const MyComponent = ({ title, onSubmit }: Props) => {
  // 4. Hooks
  const [state, setState] = useState('')

  // 5. Handlers
  const handleClick = () => {
    onSubmit()
  }

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Submit</button>
    </div>
  )
}
```

### Avoid Inline Object Props

```tsx
// Good - pass primitives or use memo
const Component = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>
}

// Avoid - inline objects cause re-renders
const Component = () => {
  return <button onClick={() => doSomething()}>Click</button>
}
```

## CSS / Tailwind Conventions

### Use `cn()` Utility

```tsx
// Combine classes conditionally
import { cn } from '@/lib/utils'
;<div
  className={cn(
    'base-class',
    isActive && 'active-class',
    variant === 'primary' && 'primary-class',
  )}
/>
```

### Avoid Arbitrary Values

```tsx
// Good - use CSS variables or theme
<div className="bg-sidebar" />
<div className="text-primary" />

// Avoid - arbitrary values
<div className="bg-[#123456]" />
```

## Git Conventions

### Commit Messages

```
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
refactor: simplify query client setup
test: add login form tests
```

### Branch Naming

```
feature/add-user-profile
fix/login-redirect-loop
docs/api-reference
```

## Testing

- Test files colocated with components
- Use Vitest for unit tests
- Follow AAA pattern: Arrange, Act, Assert

```tsx
// components/button/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## Further Reading

- [Architecture](./ARCHITECTURE.md) - High-level architecture
- [Patterns](./PATTERNS.md) - Common patterns with examples
