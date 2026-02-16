import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { getThemeServerFn, resolveTheme } from '@/server/theme'
import { Providers } from '@/components/providers'
import { NotFound } from '@/components/not-found'
import {
  ThemeDetectionScript,
  generateThemeScript,
} from '@/components/inline-scripts'
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: async () => {
      const theme = await getThemeServerFn()

      // On server, resolve theme immediately
      // On client, we can't access headers, so we'll rely on the inline script
      let resolvedTheme: 'light' | 'dark'

      if (typeof window === 'undefined') {
        // Server-side: check Accept-CH header or default to light
        // Since we can't detect system preference on server without client hints,
        // we default to light for SSR and let the client script correct it immediately
        resolvedTheme = resolveTheme(theme, false)
      } else {
        // Client-side during navigation: use matchMedia
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        resolvedTheme = resolveTheme(theme, prefersDark)
      }

      return { theme, resolvedTheme }
    },
    head: ({ loaderData }) => {
      const resolvedTheme = loaderData?.resolvedTheme ?? 'light'

      return {
        meta: [
          {
            charSet: 'utf-8',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            title: 'TanStack Start Starter',
          },
        ],
        links: [
          {
            rel: 'stylesheet',
            href: appCss,
          },
          { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
          { rel: 'apple-touch-icon', href: '/logo192.png' },
        ],
        scripts: [
          {
            type: 'text/javascript',
            children: generateThemeScript(resolvedTheme),
          },
        ],
      }
    },
    shellComponent: RootDocument,
    notFoundComponent: () => <NotFound />,
  },
)

interface RootDocumentProps {
  children: React.ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  const { theme, resolvedTheme } = Route.useLoaderData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <Providers theme={theme} resolvedTheme={resolvedTheme}>
          {children}
        </Providers>

        {process.env.NODE_ENV === 'development' ? (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: true,
              },
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}

        <ThemeDetectionScript />
        <Scripts />
      </body>
    </html>
  )
}
