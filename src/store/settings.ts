import { signal, effect } from '@preact/signals'

export type PredictorMethod = 'simple' | 'distribution' | 'adaptive'

export type FeedingSettings = {
  predictorMethod: PredictorMethod
  simpleIntervalMinutes: number
  targetDailySessions: number
  wakingStartHour: number
  wakingEndHour: number
}

const DEFAULT_SETTINGS: FeedingSettings = {
  predictorMethod: 'distribution',
  simpleIntervalMinutes: 150,
  targetDailySessions: 10,
  wakingStartHour: 6,
  wakingEndHour: 22
}

const loadSettings = (): FeedingSettings => {
  try {
    const saved = localStorage.getItem('feeding-settings')
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return DEFAULT_SETTINGS
}

export const feedingSettings = signal<FeedingSettings>(loadSettings())

effect(() => {
  try {
    localStorage.setItem('feeding-settings', JSON.stringify(feedingSettings.value))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
})

export const updateSettings = (updates: Partial<FeedingSettings>) => {
  feedingSettings.value = { ...feedingSettings.value, ...updates }
}

