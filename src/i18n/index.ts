import { computed } from '@preact/signals'
import { language } from '../store/language'
import { en, type TranslationDict } from './en'
import { et } from './et'

export type { Language } from '../store/language'
export { language, setLanguage, LANGUAGES, LANGUAGE_META } from '../store/language'
export type { TranslationDict } from './en'

const DICTIONARIES: Record<string, TranslationDict> = { en, et }

export const translations = computed<TranslationDict>(() => DICTIONARIES[language.value] ?? en)
