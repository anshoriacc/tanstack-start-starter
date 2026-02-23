import React from 'react'
import type { TTheme } from '@/server/theme'
import { ThemeContext } from '@/lib/theme-context'
import { useThemeStore, getSystemTheme, applyTheme } from '@/stores/theme'
import { GlobalCommandPalette } from './command-palette'
import { ThemeHotkey } from '@/components/theme-hotkey'

type Props = {
  children: React.ReactNode
  theme: TTheme
}

export const Providers = ({ theme, children }: Props) => {
  // Listen for OS-level theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const state = useThemeStore.getState()
      const effectiveTheme = state.theme ?? theme
      if (effectiveTheme === 'system') {
        const resolved = getSystemTheme()
        useThemeStore.setState({ resolvedTheme: resolved })
        applyTheme(resolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
      <ThemeHotkey />
      <GlobalCommandPalette />
    </ThemeContext.Provider>
  )
}
