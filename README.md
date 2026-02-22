# TanStack Start Starter

A modern, type-safe full-stack React boilerplate with authentication, routing, and data fetching.

## Demo

Preview: [http://starter.anshori.com/](http://starter.anshori.com/)

## Tech Stack

- **Framework**: TanStack Start (React 19 + Vite)
- **Routing**: TanStack Router (type-safe file-based routing)
- **Data Fetching**: TanStack Query v5
- **Forms**: TanStack Form
- **Auth**: Better Auth
- **Styling**: TailwindCSS v4 + shadcn/ui components
- **State**: Zustand
- **Testing**: Vitest

## Features

- Type-safe routing with TanStack Router
- SSR with hydration support
- Authentication with Better Auth (credentials + session)
- Protected routes with middleware
- Theme system (light/dark/system) with SSR flash prevention
- Command palette (Cmd+K)
- Hotkeys support
- DevTools integration (React Query, Router, Form, Hotkeys)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint & format
pnpm check
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # shadcn-like components
├── hooks/           # Custom React hooks
│   └── api/        # Data fetching hooks
├── lib/             # Utilities & clients
│   ├── auth/       # Better Auth setup
│   ├── query-client.ts
│   └── utils.ts
├── routes/          # File-based routes
├── server/          # Server-side code
├── stores/          # Zustand stores
└── router.tsx      # Router configuration
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Conventions](./docs/CONVENTIONS.md)
- [Patterns](./docs/PATTERNS.md)

## Environment Variables

Create a `.env` file:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
API_BASE_URL=https://dummyjson.com
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |
| `pnpm test`    | Run tests                |
| `pnpm lint`    | Lint code                |
| `pnpm format`  | Format code              |
| `pnpm check`   | Lint & format            |
