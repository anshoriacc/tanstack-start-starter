import { create } from 'zustand'

import {
  type TTheme,
  type TResolvedTheme,
  setThemeServerFn,
} from '@/server/theme'
import { useLoaderTheme } from '@/lib/theme-context'

export type { TTheme, TResolvedTheme }

interface ThemeStore {
  theme: TTheme | null
  resolvedTheme: TResolvedTheme | null
  setTheme: (theme: TTheme) => Promise<void>
}

export function getSystemTheme(): TResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(
  theme: TTheme,
  systemTheme: TResolvedTheme,
): TResolvedTheme {
  if (theme === 'system') return systemTheme
  return theme
}

function createTransitionDisablingStylesheet(): HTMLStyleElement {
  const css = document.createElement('style')
  css.type = 'text/css'
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        transition: none !important;
      }`,
    ),
  )
  return css
}

function disableTransitions(): HTMLStyleElement {
  const css = createTransitionDisablingStylesheet()
  document.head.appendChild(css)
  return css
}

function enableTransitions(css: HTMLStyleElement): void {
  window.getComputedStyle(css).opacity
  document.head.removeChild(css)
}

export function applyTheme(resolvedTheme: TResolvedTheme) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  const transitionsDisabled = disableTransitions()
  html.classList.remove('light', 'dark')
  html.classList.add(resolvedTheme)
  enableTransitions(transitionsDisabled)
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: null,
  resolvedTheme: null,

  setTheme: async (theme) => {
    const resolved = resolveTheme(theme, getSystemTheme())
    set({ theme, resolvedTheme: resolved })
    applyTheme(resolved)

    try {
      await setThemeServerFn({ data: theme })
    } catch (error) {
      console.error('Failed to persist theme:', error)
    }
  },
}))

/**
 * Returns the active theme mode (system/light/dark).
 * Loader data is the default; Zustand overrides after user interaction.
 */
export function useTheme(): TTheme {
  const loaderTheme = useLoaderTheme()
  const storeTheme = useThemeStore((s) => s.theme)
  return storeTheme ?? loaderTheme
}

/**
 * Returns the resolved theme (light/dark).
 * On server with 'system', falls back to 'light' — the blocking script handles CSS.
 */
export function useResolvedTheme(): TResolvedTheme {
  const theme = useTheme()
  const storeResolved = useThemeStore((s) => s.resolvedTheme)

  // After user interaction, store has the resolved value
  if (storeResolved !== null) return storeResolved

  // Initial render: resolve from the loader theme
  return resolveTheme(theme, getSystemTheme())
}

export const useSetTheme = () => useThemeStore((s) => s.setTheme)

export const useToggleTheme = () => {
  const resolvedTheme = useResolvedTheme()
  const setTheme = useSetTheme()

  return () => {
    const newTheme: TTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
}
