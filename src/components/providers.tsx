import React from 'react'
import type { TTheme, TResolvedTheme } from '@/server/theme'
import { useThemeStore } from '@/stores/theme.store'

interface ProvidersProps {
  children: React.ReactNode
  theme: TTheme
  resolvedTheme: TResolvedTheme
}

export function Providers({ children, theme, resolvedTheme }: ProvidersProps) {
  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (!initialized.current) {
      useThemeStore.getState().initTheme(theme, resolvedTheme)
      initialized.current = true
    }
  }, [theme, resolvedTheme])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light'
      useThemeStore.getState().setSystemTheme(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return <>{children}</>
}
