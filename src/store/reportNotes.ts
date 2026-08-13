import { signal, effect } from '@preact/signals'

const STORAGE_KEY = 'report-personal-notes'

const loadNotes = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch (e) {
    console.error('Failed to load report notes:', e)
    return ''
  }
}

export const reportNotes = signal<string>(loadNotes())

effect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, reportNotes.value)
  } catch (e) {
    console.error('Failed to save report notes:', e)
  }
})

export const setReportNotes = (value: string) => {
  reportNotes.value = value
}
