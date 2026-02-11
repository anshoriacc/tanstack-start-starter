import React from 'react'

const THEME_DETECTION_SCRIPT = `(function() {
  try {
    const THEME_COOKIE = '_preferred-theme'
    const DEFAULT_THEME = 'system'
    
    const cookieMatch = document.cookie.match(
      new RegExp('(?:^|; )' + THEME_COOKIE + '=([^;]*)')
    )
    const savedTheme = cookieMatch ? cookieMatch[1] : DEFAULT_THEME
    
    let resolvedTheme
    if (savedTheme === 'system' || !savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      resolvedTheme = prefersDark ? 'dark' : 'light'
    } else {
      resolvedTheme = savedTheme
    }
    
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolvedTheme)
    document.documentElement.dataset.theme = savedTheme || 'system'
  } catch (e) {}
})()`

export function ThemeDetectionScript(): React.ReactNode {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_DETECTION_SCRIPT }}
      suppressHydrationWarning
    />
  )
}

export function generateThemeScript(resolvedTheme: 'light' | 'dark'): string {
  return `(function() {
    try {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add('${resolvedTheme}')
    } catch (e) {}
  })()`
}
