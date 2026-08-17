import { signal, effect } from '@preact/signals'

export type Language = 'en' | 'et'

export const LANGUAGES: Language[] = ['en', 'et']

export const LANGUAGE_META: Record<Language, { label: string; nativeLabel: string; localeTag: string }> = {
  en: { label: 'English', nativeLabel: 'English', localeTag: 'en-US' },
  et: { label: 'Estonian', nativeLabel: 'Eesti', localeTag: 'et-EE' }
}

const STORAGE_KEY = 'language-preference'

const isLanguage = (value: string): value is Language => (LANGUAGES as string[]).includes(value)

const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = navigator.languages ?? [navigator.language]
  for (const candidate of candidates) {
    const short = candidate?.slice(0, 2).toLowerCase()
    if (short && isLanguage(short)) return short
  }
  return 'en'
}

const loadLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isLanguage(saved)) return saved
  } catch (e) {
    console.error('Failed to load language preference:', e)
  }
  return detectBrowserLanguage()
}

export const language = signal<Language>(loadLanguage())

export const setLanguage = (lang: Language) => {
  language.value = lang
}

effect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, language.value)
  } catch (e) {
    console.error('Failed to save language preference:', e)
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language.value
  }
})
