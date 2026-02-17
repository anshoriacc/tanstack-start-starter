import { createContext, useContext } from 'react'
import type { TTheme } from '@/server/theme'

/**
 * Holds the theme value from the root loader (cookie).
 * Consistent between server and client — no hydration mismatch.
 */
export const ThemeContext = createContext<TTheme>('system')
export const useLoaderTheme = () => useContext(ThemeContext)
