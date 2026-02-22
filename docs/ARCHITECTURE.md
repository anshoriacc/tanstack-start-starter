# Architecture

This document describes the high-level architecture of this TanStack Start application.

## Tech Stack

| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | TanStack Start (React 19 + Vite)        |
| Routing       | TanStack Router (file-based, type-safe) |
| Data Fetching | TanStack Query v5                       |
| Forms         | TanStack Form                           |
| Auth          | Better Auth                             |
| Styling       | TailwindCSS v4                          |
| UI Components | shadcn/ui-style components              |
| State         | Zustand                                 |
| Testing       | Vitest                                  |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn-style components (40+)
│   ├── providers.tsx    # Context providers
│   ├── header.tsx       # App header
│   ├── app-sidebar.tsx  # Dashboard sidebar
│   └── command-palette.tsx
├── hooks/               # Custom React hooks
│   ├── api/             # API/data fetching hooks
│   │   ├── auth.ts      # Auth hooks (login, logout, session)
│   │   └── user.ts      # User hooks
│   └── use-mobile.ts    # Mobile detection
├── lib/                 # Libraries & utilities
│   ├── auth/
│   │   ├── client.ts    # Client-side auth (better-auth/react)
│   │   ├── server.ts    # Server-side auth (better-auth)
│   │   └── plugins.ts   # Custom auth plugins
│   ├── query-client.ts  # TanStack Query setup
│   ├── axios.ts         # Axios instance
│   ├── theme-context.tsx
│   ├── utils.ts         # Utility functions (cn, etc.)
│   └── theme-context.tsx
├── routes/              # File-based routing (TanStack Router)
├── server/
│   ├── auth.ts          # Server auth functions (createServerFn)
│   ├── axios.ts         # Server axios instance
│   └── theme.ts         # Server theme functions
├── stores/              # Zustand stores
│   ├── theme.ts         # Theme store
│   └── command.ts       # Command palette store
├── middleware.ts/       # Route middleware
│   └── auth.ts          # Auth middleware (protected/auth)
├── schema/              # Zod schemas
│   └── auth.ts
├── constants/           # Environment variables
│   └── env.ts
├── router.tsx           # Router configuration
├── routeTree.gen.ts    # Generated route tree
└── styles.css          # Global styles
```

## Data Flow

### SSR + Hydration

```
┌─────────────────────────────────────────────────────────────┐
│                      Server (SSR)                           │
├─────────────────────────────────────────────────────────────┤
│  1. Request received                                        │
│  2. Loader runs (fetch data, auth session)                  │
│  3. HTML generated with inline theme script                 │
│  4. Prefetched queries dehydrated to HTML                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Browser                                │
├─────────────────────────────────────────────────────────────┤
│  1. HTML loads                                              │
│  2. Inline script applies theme (prevents flash)           │
│  3. React hydrates                                          │
│  4. Dehydrated queries hydrate                              │
│  5. Client takes over (queries, interactions)               │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Client-Side Auth                         │
├─────────────────────────────────────────────────────────────┤
│  useSession() → authClient.getSession() → Cookie + State    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server-Side Auth                         │
├─────────────────────────────────────────────────────────────┤
│  loader → auth.api.getSession({ headers }) → Session       │
│  protected route middleware checks session                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Better Auth)                  │
├─────────────────────────────────────────────────────────────┤
│  /api/auth/* → Better Auth handlers                        │
│  - signInCredentials                                        │
│  - signOut                                                  │
│  - getSession                                               │
│  - refreshToken                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. File-Based Routing

Routes are defined in `src/routes/` using TanStack Router's file-based routing:

| File                                         | Route                               |
| -------------------------------------------- | ----------------------------------- |
| `routes/index.tsx`                           | `/`                                 |
| `routes/_auth/login/index.tsx`               | `/login`                            |
| `routes/_protected/_dashboard/dashboard.tsx` | `/dashboard`                        |
| `routes/_protected.tsx`                      | Layout wrapper for protected routes |
| `routes/_auth.tsx`                           | Layout wrapper for auth routes      |

### 2. Query Client

The query client is configured for SSR with proper dehydration:

- Server creates a fresh query client
- Queries are prefetched in loaders
- Queries are dehydrated to HTML
- Client hydrates and resumes caching

### 3. Theme System

SSR-safe theme handling:

1. **Server**: `getThemeServerFn()` fetches user preference
2. **Inline Script**: `generateThemeScript()` applies theme before React loads
3. **Client**: Zustand store manages theme state
4. **Hooks**: `useTheme()` returns user preference, `useResolvedTheme()` returns actual theme

### 4. Middleware

Route middleware for protection:

- `protectedMiddleware`: Redirects unauthenticated users to login
- `authMiddleware`: Redirects authenticated users away from auth pages (login)

## Environment Variables

```env
# Auth (required)
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# API (optional, for demo data)
API_BASE_URL=https://dummyjson.com
```

## Further Reading

- [Conventions](./CONVENTIONS.md) - Code conventions and patterns
- [Patterns](./PATTERNS.md) - Common patterns with examples
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
