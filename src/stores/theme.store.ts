import { create } from 'zustand'
import { setThemeServerFn, type TTheme, type TResolvedTheme } from '@/server/theme'

export type { TTheme, TResolvedTheme }

interface ThemeStore {
  theme: TTheme
  resolvedTheme: TResolvedTheme
  systemTheme: TResolvedTheme
  initTheme: (theme: TTheme, resolvedTheme: TResolvedTheme) => void
  setTheme: (theme: TTheme) => Promise<void>
  setSystemTheme: (systemTheme: TResolvedTheme) => void
}

const getInitialTheme = (): { theme: TTheme; resolvedTheme: TResolvedTheme } => {
  if (typeof document === 'undefined') {
    return { theme: 'system', resolvedTheme: 'dark' }
  }
  
  const html = document.documentElement
  const datasetTheme = html.dataset.theme as TTheme | undefined
  const classTheme = html.classList.contains('light') 
    ? 'light' 
    : html.classList.contains('dark') 
      ? 'dark' 
      : null
  
  const resolvedTheme = classTheme || 'dark'
  const theme = datasetTheme || (classTheme as TTheme) || 'system'
  
  return { theme, resolvedTheme }
}

const resolveTheme = (theme: TTheme, systemTheme: TResolvedTheme): TResolvedTheme => {
  if (theme === 'system') {
    return systemTheme
  }
  return theme
}

const applyTheme = (resolvedTheme: TResolvedTheme) => {
  if (typeof document === 'undefined') return
  
  const html = document.documentElement
  html.classList.remove('light', 'dark')
  html.classList.add(resolvedTheme)
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  const initial = getInitialTheme()
  
  return {
    theme: initial.theme,
    resolvedTheme: initial.resolvedTheme,
    systemTheme: initial.resolvedTheme,
    
    initTheme: (theme, resolvedTheme) => {
      set({ theme, resolvedTheme })
    },
    
    setTheme: async (theme) => {
      const { systemTheme } = get()
      const resolvedTheme = resolveTheme(theme, systemTheme)
      
      set({ theme, resolvedTheme })
      applyTheme(resolvedTheme)
      
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme
      }
      
      try {
        await setThemeServerFn({ data: theme })
      } catch (error) {
        console.error('Failed to persist theme:', error)
      }
    },
    
    setSystemTheme: (systemTheme) => {
      const { theme } = get()
      const resolvedTheme = resolveTheme(theme, systemTheme)
      
      set({ systemTheme, resolvedTheme })
      
      if (theme === 'system') {
        applyTheme(resolvedTheme)
      }
    },
  }
})

export const useTheme = () => useThemeStore((state) => state.theme)
export const useResolvedTheme = () => useThemeStore((state) => state.resolvedTheme)
export const useSetTheme = () => useThemeStore((state) => state.setTheme)
export const useSystemTheme = () => useThemeStore((state) => state.systemTheme)
