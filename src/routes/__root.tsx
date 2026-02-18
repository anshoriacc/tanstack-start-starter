import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import appCss from '../styles.css?url'
import { useResolvedTheme } from '@/stores/theme'
import { getThemeServerFn } from '@/server/theme'
import { getSessionQueryOptions } from '@/hooks/api/auth'
import { GlobalCommandPalette } from '@/components/command-palette'
import { generateThemeScript } from '@/components/inline-scripts'
import { Providers } from '@/components/providers'
import { NotFound } from '@/components/not-found'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async ({ context }) => {
    const theme = await getThemeServerFn()
    await context.queryClient.prefetchQuery(getSessionQueryOptions)
    return { theme }
  },
  head: ({ loaderData }) => {
    const theme = loaderData?.theme ?? 'system'

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
          children: generateThemeScript(theme),
        },
        {
          defer: true,
          src: 'https://umami.anshori.com/script.js',
          'data-website-id': '01d9ec99-e838-4331-8e70-7d9c7ca2926a',
        },
      ],
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

interface RootDocumentProps {
  children: React.ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  const loaderData = Route.useLoaderData()
  const theme = loaderData?.theme ?? 'system'
  const resolvedTheme = useResolvedTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <Providers theme={theme}>{children}</Providers>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            formDevtoolsPlugin(),
            hotkeysDevtoolsPlugin(),
          ]}
        />

        <GlobalCommandPalette />

        <Toaster theme={resolvedTheme} richColors />

        <Scripts />
      </body>
    </html>
  )
}
