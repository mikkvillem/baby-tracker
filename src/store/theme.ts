import { signal, effect } from '@preact/signals'
import { type ThemeId, resolveTheme } from '../themes/registry'

const STORAGE_KEY = 'theme-preference'

const loadThemeId = (): ThemeId => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved as ThemeId
  } catch (e) {
    console.error('Failed to load theme preference:', e)
  }
  return 'system'
}

export const themeId = signal<ThemeId>(loadThemeId())

export const setThemeId = (id: ThemeId) => {
  themeId.value = id
}

const THEME_COLOR: Record<string, string> = {
  'default-light': '#fce7f3',
  'default-dark': '#1f1b18',
  'kindle-light': '#ececec',
  'kindle-dark': '#121212'
}

const applyTheme = (id: ThemeId) => {
  const { palette, dark } = resolveTheme(id)
  const root = document.documentElement
  root.dataset.theme = palette
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'

  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch (e) {
    console.error('Failed to save theme preference:', e)
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  const color = THEME_COLOR[`${palette}-${dark ? 'dark' : 'light'}`]
  if (meta && color) meta.setAttribute('content', color)
}

effect(() => {
  applyTheme(themeId.value)
})

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeId.value === 'system') applyTheme('system')
  })
}
