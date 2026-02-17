/**
 * Blocking theme script that runs before first paint.
 * Reads the cookie, resolves system preference, applies the class,
 * and stashes the result on `window.__INITIAL_THEME__` for hydration.
 */
export function generateThemeScript(
  theme: 'light' | 'dark' | 'system',
): string {
  // This script is inlined into <head> and runs synchronously before paint.
  // It MUST be self-contained — no external references.
  return `(function(){try{
var t='${theme}';
var r;
if(t==='system'){
  r=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
}else{
  r=t;
}
var d=document.documentElement;
d.classList.remove('light','dark');
d.classList.add(r);
window.__INITIAL_THEME__={theme:t,resolvedTheme:r};
}catch(e){}})()`
}
