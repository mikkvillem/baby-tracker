// Central config for every selectable theme. To add a new theme:
//  1. Give it a palette name below (or reuse "default" / "kindle").
//  2. If it needs its own colors, add `src/styles/themes/<palette>.css` with a
//     `[data-theme="<palette>"] { --color-...: ... }` block and `@import` it
//     from `src/app.css`.
//  3. Add an entry here — `appearance: 'light' | 'dark'` picks which end of
//     the palette's ramp is used (drives Tailwind's `dark:` variants).
export type ThemeId = 'system' | 'light' | 'dark' | 'kindle' | 'kindle-dark'

export type Palette = 'default' | 'kindle'

export type ThemeDefinition = {
  id: ThemeId
  label: string
  description: string
  palette: Palette
  appearance: 'light' | 'dark' | 'system'
  swatch: {
    bg: string
    surface: string
    accent: string
    text: string
  }
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'system',
    label: 'System',
    description: 'Match your device setting',
    palette: 'default',
    appearance: 'system',
    swatch: { bg: '#f7f0e2', surface: '#ffffff', accent: '#1e4d3b', text: '#3d2920' }
  },
  {
    id: 'light',
    label: 'Light',
    description: 'The default warm palette',
    palette: 'default',
    appearance: 'light',
    swatch: { bg: '#f7f0e2', surface: '#ffffff', accent: '#1e4d3b', text: '#3d2920' }
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'The default palette, inverted',
    palette: 'default',
    appearance: 'dark',
    swatch: { bg: '#22160f', surface: '#3d2920', accent: '#7fae95', text: '#f7f0e2' }
  },
  {
    id: 'kindle',
    label: 'Kindle',
    description: 'Monochrome, e-ink inspired',
    palette: 'kindle',
    appearance: 'light',
    swatch: { bg: '#ececec', surface: '#fbfbfb', accent: '#1f1f1f', text: '#232323' }
  },
  {
    id: 'kindle-dark',
    label: 'Kindle Dark',
    description: 'Monochrome night mode',
    palette: 'kindle',
    appearance: 'dark',
    swatch: { bg: '#121212', surface: '#232323', accent: '#c2c2c2', text: '#ececec' }
  }
]

export const resolveTheme = (id: ThemeId): { palette: Palette; dark: boolean } => {
  const def = THEMES.find(t => t.id === id) ?? THEMES[0]
  const dark = def.appearance === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : def.appearance === 'dark'
  return { palette: def.palette, dark }
}
