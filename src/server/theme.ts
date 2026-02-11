import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

const themeValidator = z.union([
  z.literal('light'),
  z.literal('dark'),
  z.literal('system'),
])
export type TTheme = z.infer<typeof themeValidator>
export type TResolvedTheme = 'light' | 'dark'

const THEME_COOKIE = '_preferred-theme'
const DEFAULT_THEME: TTheme = 'system'

export const getThemeServerFn = createServerFn().handler(async () => {
  const theme = (getCookie(THEME_COOKIE) || DEFAULT_THEME) as TTheme
  return theme
})

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(themeValidator)
  .handler(async ({ data }) => {
    setCookie(THEME_COOKIE, data)
    return data
  })

export function resolveTheme(
  theme: TTheme,
  prefersDark: boolean = false,
): TResolvedTheme {
  if (theme === 'system') {
    return prefersDark ? 'dark' : 'light'
  }
  return theme
}
