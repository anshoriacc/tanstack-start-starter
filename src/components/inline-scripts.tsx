/**
 * Blocking theme script that runs before first paint.
 * Reads the cookie, resolves system preference, applies the class,
 * and stashes the result on `window.__INITIAL_THEME__` for hydration.
 */
export const generateThemeScript = (
  theme: 'light' | 'dark' | 'system',
): string =>
  // This script is inlined into <head> and runs synchronously before paint.
  // It MUST be self-contained — no external references.
  `(function() {
    try {
      const theme = '${theme}';
      let resolvedTheme;
      
      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
      } else {
        resolvedTheme = theme;
      }
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
      
      window.__INITIAL_THEME__ = {
        theme: theme,
        resolvedTheme: resolvedTheme
      };
    } catch (e) {
      // Silently fail
    }
  })()`
